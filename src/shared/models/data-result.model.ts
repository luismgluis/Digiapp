import { AppHttpResponseError } from "./app-http-response-error.model";

/**
 * Represents a data-access layer operation result.
 *
 * For CRUD operations
 *
 * @template DataType Interface or class type.
 */
export interface DataResult<DataType> {
	data?: DataType;
	validationErrors?: AppHttpResponseError[];
	isNotFound?: boolean;
	error?: Error;
}
