import AppErrorCo, { AppErrorValue } from "./AppErrorCode";

/**
 * Represents an app http error that should be sent within a failed request's response.
 *
 * @summary All error members are optional but the more details the server sends back to the client the more easy it becomes to fix the error.
 */
export interface AppHttpResponseError {
	code?: AppErrorValue;
	source?: string;
	title?: string;
	detail?: string;
}
