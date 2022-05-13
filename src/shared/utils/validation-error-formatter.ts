import { ValidationError } from "express-validator";
import { AppHttpResponseError } from "../models";

export function validationErrorFormatter(
	expressValidatorError: ValidationError
): AppHttpResponseError {
	const appErr: AppHttpResponseError = expressValidatorError.msg
		? expressValidatorError.msg
		: {};

	/* Set the name of the field that causes the error. */
	appErr.source = expressValidatorError.param;

	return appErr;
}
