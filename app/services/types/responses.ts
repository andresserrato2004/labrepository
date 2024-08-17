import type {
	ClientErrorCode,
	ResponseType,
	ServerErrorCode,
	SuccessCode,
} from '@services/utility/responses';

/**
 * Represents a response with no content.
 */
export type NoContent = null;

/**
 * Represents a stack trace for an error.
 * @example
 * const stack: ErrorStack = 'auth/loginUser';
 * const stack: ErrorStack = 'users/createUser';
 */
export type ErrorStack = `${string}/${string}`;

/**
 * Represents the response code for an API request.
 * It can be one of the following types: SuccessCode, ClientErrorCode, or ServerErrorCode.
 */
export type ResponseCode = SuccessCode | ClientErrorCode | ServerErrorCode;

/**
 * Represents an object that maps keys of type T to error messages.
 * @template T - The type of the keys in the object.
 * @example
 * type UserLogin = {
 *   email: string;
 *   password: string;
 * };
 *
 * const errors: Errors<UserLogin> = {
 *   email: 'Email is incorrect',
 *   password: 'Password is required',
 * };
 */
export type Errors<T> = Record<keyof T, string>;

/**
 * Represents the response structure for a base service.
 * This type is used to define the response structure for all services
 * and shouldn't be used directly in the application.
 * @template SuccessPayload - The type of the success payload.
 * @template ErrorShape - The type of the error shape.
 */
export interface BaseServiceResponse<SuccessPayload, ErrorShape> {
	type: ResponseType;
	data: SuccessPayload;
	errors: Errors<ErrorShape>;
	code: ResponseCode;
}

/**
 * Represents a client error response.
 * Usually, this type of response is returned when the client sends an invalid request.
 * @template ErrorShape - The shape of the error object.
 * @example
 * const response: ClientErrorResponse<UserLogin> = {
 *  code: ClientErrorCode.Forbidden,
 *  type: ResponseType.ClientError,
 *  errors: {
 *   email: 'Email is incorrect',
 *   password: 'Password is incorrect',
 *  },
 * };
 * @see {@link Errors}
 */
export interface ClientErrorResponse<ErrorShape>
	extends Omit<BaseServiceResponse<undefined, ErrorShape>, 'data'> {
	type: ResponseType.ClientError;
	errors: Errors<ErrorShape>;
	code: ClientErrorCode;
}

/**
 * Represents a server error response.
 * Usually, this type of response is returned when the server encounters an error.
 * The errors field is not present in this type of response because the server error
 * is not related to the client request.
 * @example
 * const response: ServerErrorResponse = {
 *  code: ServerErrorCode.InternalServerError,
 *  type: ResponseType.ServerError,
 *  logId: 'abc123',
 * };
 * @see {@link ServerErrorCode}
 */
export interface ServerErrorResponse
	extends Omit<BaseServiceResponse<undefined, undefined>, 'data' | 'errors'> {
	type: ResponseType.ServerError;
	code: ServerErrorCode;
	logId: string;
}

/**
 * Represents a success response.
 * This type of response is returned when the client request is successful.
 * @template SuccessPayload - The type of the success payload.
 * @example
 * const response: SuccessResponse<User> = {
 *  code: SuccessCode.Ok,
 *  type: ResponseType.Success,
 *  data: {
 *   id: 1,
 *   name: 'Julio Garavito',
 *   username: 'JG123',
 *   sessionToken: '$$#-/abc123',
 *  },
 * };
 */
export interface SuccessResponse<SuccessPayload>
	extends Omit<BaseServiceResponse<SuccessPayload, undefined>, 'errors'> {
	type: ResponseType.Success;
	code: SuccessCode;
}

/**
 * Represents the response for a service.
 * This type is used to define the response structure for all services
 * and should be used as the return type for all service functions.
 * @template S - The type of the success payload. If the service doesn't return any data, use NoContent type.
 * @template E - The type of the error shape. If the service doesn't return any client errors, leave this type as undefined or blank.
 * @example
 * const response: ServiceResponse<User, UserLogin> = {
 *  code: SuccessCode.Ok,
 *  type: ResponseType.Success,
 *  data: {
 *   id: 1,
 *   name: 'Julio Garavito',
 *   username: 'JG123',
 *   sessionToken: '$$#-/abc123',
 *   },
 * };
 * @see {@link SuccessResponse}
 * @see {@link ClientErrorResponse}
 * @see {@link ServerErrorResponse}
 * @see {@link NoContent}
 */
export type ServiceResponse<S = unknown, E = undefined> = E extends undefined
	? SuccessResponse<S> | ServerErrorResponse
	: SuccessResponse<S> | ClientErrorResponse<E> | ServerErrorResponse;

/**
 * Represents the arguments for the handleUnknownError function.
 * @see {@link handleUnknownError}
 */
export interface HandleUnknownErrorArgs {
	error: unknown;
	stack: ErrorStack;
	additionalInfo?: Record<string, unknown>;
}
