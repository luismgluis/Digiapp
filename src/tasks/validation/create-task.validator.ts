import { check } from "express-validator";
import AppErrorCo from "../../shared/models/AppErrorCode";

/**
 * The create task data-model validator.
 */
export const createTaskValidator = [
	/* title field. */
	check("title")
		.exists({ checkNull: true })
		.withMessage({
			code: AppErrorCo.IsRequired,
			title: "Field is required",
			detail: "Title is required",
		})

		.isString()
		.withMessage({
			code: AppErrorCo.InvalidType,
			title: "Invalid field type",
			detail: "Title must be series of characters (String)",
		}),

		// .trim()
		// .isLength({ min: 2, max: 50 })
		// .withMessage({
		// 	code: AppErrorCo.InvalidLength,
		// 	title: "Invalid field length",
		// 	detail: "title must be from (2 - 50) characters length",
		// }),

	/* description field. */
	check("description")
		.exists({ checkNull: true })
		.withMessage({
			code: AppErrorCo.IsRequired,
			title: "Field is required",
			detail: "Description is required",
		})

		.isString()
		.withMessage({
			code: AppErrorCo.InvalidType,
			title: "Invalid field type",
			detail: "Description must be series of characters (String)",
		})

		.trim()
		.isLength({ min: 2, max: 500 })
		.withMessage({
			code: AppErrorCo.InvalidLength,
			title: "Invalid field length",
			detail: "Description must be from (2 - 50) characters length",
		}),
];
