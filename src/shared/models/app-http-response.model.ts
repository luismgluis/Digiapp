import { AppHttpResponseMeta } from "./app-http-response-meta.model";
import { AppHttpResponseError } from "./app-http-response-error.model";

/**
 * Represents an application http-response's body in case of success or even failure.
 */
export interface AppHttpResponse {
	data?: unknown;
	meta?: AppHttpResponseMeta;
	errors?: AppHttpResponseError[];
}
