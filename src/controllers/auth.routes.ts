import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Auth, AuthDataAccess, authValidator } from "../auth";
import { Ok, validationErrorFormatter, BadRequest, Database } from "../shared";

export const authRelativeRoute = "auth";

export const authRouter = (db: Database) => {
	const router = Router();
	const authDataAccess = new AuthDataAccess(db);

	/* Create user-auth-create route. */
	router.post(
		"/create",
		authValidator,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const validationErrors = validationResult(req)
					.formatWith(validationErrorFormatter)
					.array({ onlyFirstError: true }); // si no concuerda con el modelo nos bota error

				if (validationErrors.length) {
					return BadRequest(res, { errors: validationErrors });
				}

				const data: Auth = { ...req.body };
				const result = await authDataAccess.create(data);

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

	/* Create login route. */
	router.post(
		"/",
		authValidator,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const validationErrors = validationResult(req)
					.formatWith(validationErrorFormatter)
					.array({ onlyFirstError: true }); // si no concuerda con el modelo nos bota error

				if (validationErrors.length) {
					return BadRequest(res, { errors: validationErrors });
				}

				const data: Auth = { ...req.body };
				const result = await authDataAccess.login(data);

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

	return router;
};
