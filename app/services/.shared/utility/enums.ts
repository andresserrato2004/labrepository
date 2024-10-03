/**
 * Defines the possible response types.
 *
 * @enum {string}
 * @readonly
 */
export enum ResponseType {
	Success = 'success',
	ClientError = 'clientError',
	ServerError = 'serverError',
}

Object.freeze(ResponseType);

/**
 * Defines the possible success response codes.
 *
 * @enum {number}
 * @readonly
 */
export enum SuccessCode {
	Ok = 200,
	Created = 201,
}

Object.freeze(SuccessCode);

/**
 * Defines the possible client error response codes.
 *
 * @enum {number}
 * @readonly
 */
export enum ClientErrorCode {
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	Conflict = 409,
}

Object.freeze(ClientErrorCode);

/**
 * Defines the possible server error response codes.
 *
 * @enum {number}
 * @readonly
 */
export enum ServerErrorCode {
	InternalServerError = 500,
	NotImplemented = 501,
	BadGateway = 502,
	ServiceUnavailable = 503,
	GatewayTimeout = 504,
}

Object.freeze(ServerErrorCode);

/**
 * Defines the possible HTTP methods.
 *
 * @enum {string}
 * @readonly
 */
export enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Patch = 'PATCH',
	Delete = 'DELETE',
}

Object.freeze(HttpMethod);

/**
 * Enum representing HTTP content types.
 *
 * @enum {string}
 * @property {string} FormData - Represents 'multipart/form-data' content type.
 * @property {string} Json - Represents 'application/json' content type.
 */
export enum HttpContentType {
	Unknown = '',
	FormData = 'multipart/form-data',
	Json = 'application/json',
}

Object.freeze(HttpContentType);

/**
 * All enums are frozen to prevent modification.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze}
 */
