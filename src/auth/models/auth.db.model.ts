import { Sequelize, DataTypes, ModelCtor, Model } from "sequelize";
import { Auth } from "./auth.model";
const AuthSequelize = (sequelize: Sequelize): ModelCtor<Model<keyof Auth, any>> => {
	const Auth = sequelize.define("auth", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true,
		},
		user: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
		},
		creationDate: {
			type: DataTypes.INTEGER,
		},
	});

	return Auth;
};
export default AuthSequelize;
