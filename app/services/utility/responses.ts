export enum ResponseType {
	Success = 'success',
	ClientError = 'clientError',
	ServerError = 'serverError',
}

Object.freeze(ResponseType);

export enum SuccessCode {
	Ok = 200,
	Created = 201,
}

Object.freeze(SuccessCode);

export enum ClientErrorCode {
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	Conflict = 409,
}

Object.freeze(ClientErrorCode);

export enum ServerErrorCode {
	InternalServerError = 500,
	NotImplemented = 501,
	BadGateway = 502,
	ServiceUnavailable = 503,
	GatewayTimeout = 504,
}

Object.freeze(ServerErrorCode);

export enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Patch = 'PATCH',
	Delete = 'DELETE',
}

Object.freeze(HttpMethod);
