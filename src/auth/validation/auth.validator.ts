import { check } from "express-validator";
import AppErrorCo from "../../shared/models/AppErrorCode";


export const authValidator = [
	/* id field. */
	check("user")
		.exists({ checkNull: true })
		.withMessage({
			code: AppErrorCo.IsRequired,
			title: "Field is required",
			detail: "user is required",
		})
		.isString()
		.withMessage({
			code: AppErrorCo.InvalidType,
			title: "Invalid field type",
			detail: "user must be an (String)",
		}),
	/* password field. */
	check("password")
		.exists({ checkNull: true })
		.withMessage({
			code: AppErrorCo.IsRequired,
			title: "Field is required",
			detail: "password is required",
		})
		.isString()
		.withMessage({
			code: AppErrorCo.InvalidType,
			title: "Invalid field type",
			detail: "password must be an (String)",
		}),
];
