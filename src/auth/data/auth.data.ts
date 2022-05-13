import _ from "lodash";
import { Op } from "sequelize";
import {  Logger } from "../../shared";
import AppErrorCo from "../../shared/models/AppErrorCode";
import { Database, DataResult } from "../../shared/models";
import { Auth } from "../models";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const cryptPassword = (password: string) => {
	return new Promise<{ error: Error; hash?: string }>((resolve, reject) => {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				reject(err);
				return;
			}

			bcrypt.hash(password, salt, (err, hash) => {
				return resolve({ error: err, hash });
			});
		});
	});
};
export const comparePassword = (plainPass: string, hashword: string) => {
	return new Promise<{ error: Error; isPasswordMatch?: boolean }>(
		(resolve, reject) => {
			bcrypt.compare(
				plainPass,
				hashword,
				function (err, isPasswordMatch) {
					return !err
						? resolve({
								error: null,
								isPasswordMatch: isPasswordMatch,
						  })
						: reject(err);
				}
			);
		}
	);
};

export const tokenAuthGenerate = (text: string) => {
	const pass = process.env.TOKEN_GENERATOR_PASS;
	const token = jwt.sign(
		{
			expiresIn: "1h",
			data: text,
		},
		pass
	);
	return token;
};
export const tokenAuthCheck = (token: string) => {
	try {
		const pass = process.env.TOKEN_GENERATOR_PASS;
		const decoded = jwt.verify(token, pass);
		return decoded;
	} catch (error) {
		return null;
	}
};

export class AuthDataAccess {
	db: Database;
	constructor(db: Database) {
		this.db = db;
	}
	public async login(authData: Auth): Promise<DataResult<Auth>> {
		const result: DataResult<Auth> = {
			error: null,
		};

		try {
			const db = this.db;
			result.data = authData;

			const userInfo: Auth | null = await db.authModel
				.findAll({
					where: {
						user: {
							[Op.eq]: authData.user,
						},
					},
				} as any)
				.then((res) => {
					if (res.length > 0) {
						const data: any = res[0];
						return data;
					}
					return null;
				})
				.catch((err) => {
					Logger.error("Fail to login user", err);
					return null;
				});
			let authTokenResult = null;
			if (userInfo) {
				const idUser = userInfo.id;
				const passHash = userInfo.password;
				const passCheck = await comparePassword(
					result.data.password,
					passHash
				);
				if (passCheck.isPasswordMatch) {
					authTokenResult = tokenAuthGenerate(idUser);
				}
			}

			if (authTokenResult) {
				result.data.token = authTokenResult;
				result.data.id = userInfo.id;
				result.data.password = "[encrypted]";
				db.saveUserAuth(userInfo.id, authTokenResult);
				// db.push(result.data);
				return result;
			}
			result.error = Error("Fail to login with this user and password");
			result.validationErrors = [
				{
					code: AppErrorCo.RelatedEntityNotFound,
				},
			];
		} catch (error) {
			result.error = error;
			result.validationErrors = [
				{
					code: AppErrorCo.InternalServerError,
				},
			];
		}

		return result;
	}

	public async create(data: Auth): Promise<DataResult<Auth>> {
		const result: DataResult<Auth> = {};

		try {
			const db = this.db;
			const passCrypt = await cryptPassword(data.password);
			if (passCrypt.error) throw new Error("Password crypt fail");
			data.password = passCrypt.hash;

			const authIdResult = await db.authModel
				.create(data as any)
				.then((res) => {
					console.log(res);
					const data: any = res;
					return data.id;
				})
				.catch((err) => {
					console.log(err);
					return err;
				});
			result.data = {
				...data,
				id: authIdResult,
				password: "[encrypted]",
			};
			return result;
		} catch (error) {
			result.error = error;
			result.validationErrors = [
				{
					code: AppErrorCo.InternalServerError,
				},
			];
		}

		return result;
	}
}
