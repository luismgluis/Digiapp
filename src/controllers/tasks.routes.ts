import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
	Ok,
	NotFound,
	validationErrorFormatter,
	BadRequest,
	Database,
	UnAuthenticated,
} from "../shared";
import {
	createTaskValidator,
	Task,
	TasksDataAccess,
	updateTaskValidator,
} from "../tasks";

export const tasksRelativeRoute = "tasks";

export const tasksRouter = (db: Database) => {
	const router = Router();
	const tasksDataAccess = new TasksDataAccess(db);

	/* Create new task route. */
	router.post(
		"",
		createTaskValidator,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const validationErrors = validationResult(req)
					.formatWith(validationErrorFormatter)
					.array({ onlyFirstError: true }); // si no concuerda con el modelo nos bota error

				if (validationErrors.length) {
					return BadRequest(res, { errors: validationErrors });
				}
				if (
					!db.validateTokenAuth(
						req.headers.uid as string,
						req.headers.authorization
					)
				) {
					return UnAuthenticated(res);
				}
				const data: Task = { ...req.body }; // CAMBIAR A CREAR CON CLASS CONTRUCTOR PARA EVITAR OTROS DATOS
				const result = await tasksDataAccess.create(data);

				if (result.error) {
					next(result.error);
				} else if (
					result.validationErrors &&
					result.validationErrors.length
				) {
					BadRequest(res, { errors: result.validationErrors });
				} else if (result.data) {
					Ok(res, { data: result.data });
				}
			} catch (error) {
				next(error);
			}
		}
	);

	/* Search tasks route. */
	router.get("", async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (
				!db.validateTokenAuth(
					req.headers.uid as string,
					req.headers.authorization
				)
			) {
				return UnAuthenticated(res);
			}

			const result = await tasksDataAccess.getAll();

			if (result.error) {
				next(result.error);
			} else if (result.data) {
				Ok(res, { data: result.data, meta: { ...result.data } });
			}
		} catch (error) {
			next(error);
		}
	});

	/* Find category by id route. */
	router.get(
		"/:id",
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				if (
					!db.validateTokenAuth(
						req.headers.uid as string,
						req.headers.authorization
					)
				) {
					return UnAuthenticated(res);
				}
				const data = { ...req.params } as any;

				const result = await tasksDataAccess.findById(data.id);

				if (result.error) {
					next(result.error);
				} else if (result.isNotFound) {
					NotFound(res);
				} else if (result.data) {
					Ok(res, { data: result.data });
				}
			} catch (error) {
				next(error);
			}
		}
	);

	/* Update an existing category route. */
	router.put(
		"",
		updateTaskValidator,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				if (
					!db.validateTokenAuth(
						req.headers.uid as string,
						req.headers.authorization
					)
				) {
					return UnAuthenticated(res);
				}

				const validationErrors = validationResult(req)
					.formatWith(validationErrorFormatter)
					.array({ onlyFirstError: true });

				if (validationErrors.length) {
					return BadRequest(res, { errors: validationErrors });
				}

				const data: Task = req.body;
				const result = await tasksDataAccess.update(data);

				if (result.error) {
					next(result.error);
				} else if (result.isNotFound) {
					NotFound(res);
				} else if (
					result.validationErrors &&
					result.validationErrors.length
				) {
					BadRequest(res, { errors: result.validationErrors });
				} else if (result.data) {
					Ok(res, { data: result.data });
				}
			} catch (error) {
				next(error);
			}
		}
	);

	/* Delete by id route. */
	router.delete(
		"/:id",
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				if (
					!db.validateTokenAuth(
						req.headers.uid as string,
						req.headers.authorization
					)
				) {
					return UnAuthenticated(res);
				}

				const id = req.body.id as string;
				const result = await tasksDataAccess.delete(id);

				if (result.error) {
					next(result.error);
				} else if (result.isNotFound) {
					NotFound(res);
				} else if (
					result.validationErrors &&
					result.validationErrors.length
				) {
					BadRequest(res, { errors: result.validationErrors });
				} else if (result.data) {
					Ok(res, { data: result.data });
				}
			} catch (error) {
				next(error);
			}
		}
	);
	return router;
};
