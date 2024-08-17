import type {
	ClientErrorCode,
	ResponseType,
	ServerErrorCode,
	SuccessCode,
} from '@services/utility/responses';

export type ResponseCode = SuccessCode | ClientErrorCode | ServerErrorCode;

export type Errors<T> = Record<keyof T, string>;

export interface BaseServiceResponse<SuccessPayload, ErrorShape> {
	type: ResponseType;
	data: SuccessPayload;
	errors: Errors<ErrorShape>;
	code: ResponseCode;
}

export interface ClientErrorResponse<ErrorShape>
	extends Omit<BaseServiceResponse<undefined, ErrorShape>, 'data'> {
	type: ResponseType.ClientError;
	errors: Errors<ErrorShape>;
	code: ClientErrorCode;
}

export interface ServerErrorResponse
	extends Omit<BaseServiceResponse<undefined, undefined>, 'data' | 'error'> {
	type: ResponseType.ServerError;
	code: ServerErrorCode;
	logId: string;
}

export interface SuccessResponse<SuccessPayload>
	extends Omit<BaseServiceResponse<SuccessPayload, undefined>, 'errors'> {
	type: ResponseType.Success;
	code: SuccessCode;
}

export type ServiceResponse<S = unknown, E = undefined> = E extends undefined
	? SuccessResponse<S> | ServerErrorResponse
	: SuccessResponse<S> | ClientErrorResponse<E> | ServerErrorResponse;
