import _ from "lodash";
import { Logger } from "../../shared";
import AppErrorCo from "../../shared/models/AppErrorCode";
import { Database, DataResult } from "../../shared/models";
import { Task } from "../models";

export class TasksDataAccess {
	db: Database;
	constructor(db: Database) {
		this.db = db;
	}
	public async create(data: Task): Promise<DataResult<Task>> {
		const result: DataResult<Task> = {
			error: null,
		};

		try {
			const db = this.db;
			result.data = data;

			const taskIdResult = await db.taskModel
				.create(data as any)
				.then((res) => {
					console.log(res);
					return (res as any).id;
				})
				.catch((err) => {
					Logger.error("Fail to create task", err);
					return null;
				});

			if (taskIdResult) {
				result.data.id = taskIdResult;
				db.tasks.push(result.data);
				return result;
			}
			result.error = "Fail to create task" as any;
			result.validationErrors = [
				{
					code: AppErrorCo.InternalServerError,
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

	public async getAll(): Promise<DataResult<Task[]>> {
		const result: DataResult<Task[]> = {};

		try {
			const db = this.db;
			result.data = [];

			const tasks: Task[] | null = await db.taskModel
				.findAll()
				.then((res) => {
					if (res.length > 0) {
						// const data: any = res[0];
						return res;
					}
					return null;
				})
				.catch((err) => {
					Logger.error("Fail to get tasks", err);
					return null;
				});
			if (tasks) {
				result.data = tasks;
				return result;
			}
			result.validationErrors = [
				{
					code: AppErrorCo.InternalServerError,
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

	public async findById(id: number): Promise<DataResult<Task>> {
		const result: DataResult<Task> = {};
	
		try {
			const db = this.db;
			
			const tasks: Task | null = await db.taskModel
				.findByPk(id)
				.then((res) => {
					if (res) {
						// const data: any = res[0];
						return res;
					}
					return null;
				})
				.catch((err) => {
					Logger.error("Fail to get task", err);
					return null;
				});
			if (tasks) {
				result.data = tasks;
				return result;
			}
			result.validationErrors = [
				{
					code: AppErrorCo.InternalServerError,
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

	public async update(data: Task): Promise<DataResult<Task>> {
		const result: DataResult<Task> = {};

		try {
			const db = this.db;
		} catch (error) {
			result.error = error;
		}

		return result;
	}

	public async delete(id: string): Promise<DataResult<Task>> {
		const result: DataResult<Task> = {};

		try {
			const db = this.db;

			// result.data = ;
		} catch (error) {
			result.error = error;
		}

		return result;
	}
}
