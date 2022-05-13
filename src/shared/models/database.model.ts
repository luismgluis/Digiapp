import { Task } from "../../tasks";
import { Sequelize } from "sequelize";
import dbConfig from "./../../config/db.config";
import TaskSequelize from "../../tasks/models/task.db.model";
import AuthSequelize from "../../auth/models/auth.db.model";
import { tokenAuthCheck } from "../../auth";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: "mysql", //dbConfig.dialect as any,
	port: dbConfig.PORT,
	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
	// dialectOptions: {
	// 	ssl: {
	// 		ca: fs.readFileSync(path.resolve(__dirname,"./../../../ssl/ca-certificate.crt")),
	// 	},
	// },
});

const db = {
	sequelize,
	tasks: TaskSequelize(sequelize),
	auth: AuthSequelize(sequelize),
};

export class Database {
	public tasks: Task[] = [];
	public users: Record<string, { token: string }>;
	constructor() {
		this.tasks = [];
		this.users = {};
	}
	public get taskModel() {
		return db.tasks;
	}

	public get authModel() {
		return db.auth;
	}
	getUserAuth(id: string): { token: string } | null {
		if (typeof this.users[id] !== "undefined") return this.users[id];
		return null;
	}

	saveUserAuth(id: string, auth: string) {
		this.users[id] = { token: auth };
	}
	validateTokenAuth(id: string, token: string) {
		const saveToken = this.getUserAuth(id);
		if (!saveToken) return false;
		if (saveToken.token === token) {
			if (tokenAuthCheck(token)) return true;
		}
		return false;
	}
	public async connect(): Promise<Sequelize> {
		return db.sequelize.sync();
	}
}
