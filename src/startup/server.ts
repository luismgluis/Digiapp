import express, { Application } from "express";
import { Logger } from "../shared/utils";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { tasksRouter, tasksRelativeRoute, authRelativeRoute, authRouter } from "../controllers";
import { Database } from "../shared";

const LOCAL_PORT = 3000;
const db = new Database();
db.connect()
	.then((res) => Logger.info("Start DB"))
	.catch((err) => {
		console.error(err);
		Logger.error("Fail start DB", err);
	});

function setupProduction(app: Application): void {
	// Setup production middleware.
	if (process.env.NODE_ENV === "production") {
		app.use(helmet());
		app.use(compression());
	}
}

function setRequestOptions(app: Application): void {
	app.use(cors()); // cors pa javascript client
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
}

function registerRoutes(app: Application, db: Database): void {
	// usar como `/api/tasks`, `/api/products`... etc*/
	const baseRoute = "/api/";
	app.get("/", (r, res) => {
		res.status(200).send("All is well");
	});
	app.use(baseRoute + tasksRelativeRoute, tasksRouter(db));
	app.use(baseRoute + authRelativeRoute, authRouter(db));
}

export function setupServer(app: Application): void {
	setupProduction(app);
	setRequestOptions(app);
	registerRoutes(app, db);
	// create error handler
}

/**
 * Starts server.
 * @param app Express App.
 */
export function startServer(app: Application): void {
	const port = process.env.PORT || LOCAL_PORT;
	app.listen(port, () =>
		Logger.info(`Express server is running on port ${port}`, null, true)
	);
}
