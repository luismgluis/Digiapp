import { check } from "express-validator";
import AppErrorCo from "../../shared/models/AppErrorCode";

/**
 * The update task data-model validator.
 */
export const updateTaskValidator = [
	/* id field. */
	check("id")
		.exists({ checkNull: true })
		.withMessage({
			code: AppErrorCo.IsRequired,
			title: "Field is required",
			detail: "Id is required",
		})

		.isString()
		.withMessage({
			code: AppErrorCo.InvalidType,
			title: "Invalid field type",
			detail: "Id must be an (String)",
		}),

];
