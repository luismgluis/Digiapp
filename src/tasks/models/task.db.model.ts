import { Sequelize, DataTypes, ModelCtor, Model } from "sequelize";
import { Task } from "./task.model";
const TaskSequelize = (sequelize: Sequelize): ModelCtor<Model<keyof Task, any>> => {
	const Task = sequelize.define("task", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
		resolved: {
			type: DataTypes.BOOLEAN,
		},
		creationDate: {
			type: DataTypes.INTEGER,
		},
	});

	return Task;
};
export default TaskSequelize;
