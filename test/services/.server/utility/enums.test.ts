import {
	ClientErrorCode,
	HttpMethod,
	ResponseType,
	ServerErrorCode,
	SuccessCode,
} from '@services/shared/utility/enums';

import { describe, expect, it } from 'vitest';

describe('Enums', () => {
	it('should have the correct values for ResponseType', () => {
		expect(ResponseType.Success).toBe('success');
		expect(ResponseType.ClientError).toBe('clientError');
		expect(ResponseType.ServerError).toBe('serverError');
	});

	it('should have the correct values for SuccessCode', () => {
		expect(SuccessCode.Ok).toBe(200);
		expect(SuccessCode.Created).toBe(201);
	});

	it('should have the correct values for ClientErrorCode', () => {
		expect(ClientErrorCode.BadRequest).toBe(400);
		expect(ClientErrorCode.Unauthorized).toBe(401);
		expect(ClientErrorCode.Forbidden).toBe(403);
		expect(ClientErrorCode.NotFound).toBe(404);
		expect(ClientErrorCode.MethodNotAllowed).toBe(405);
		expect(ClientErrorCode.Conflict).toBe(409);
	});

	it('should have the correct values for ServerErrorCode', () => {
		expect(ServerErrorCode.InternalServerError).toBe(500);
		expect(ServerErrorCode.NotImplemented).toBe(501);
		expect(ServerErrorCode.BadGateway).toBe(502);
		expect(ServerErrorCode.ServiceUnavailable).toBe(503);
		expect(ServerErrorCode.GatewayTimeout).toBe(504);
	});

	it('should have the correct values for HttpMethod', () => {
		expect(HttpMethod.Get).toBe('GET');
		expect(HttpMethod.Post).toBe('POST');
		expect(HttpMethod.Patch).toBe('PATCH');
		expect(HttpMethod.Delete).toBe('DELETE');
	});
});

describe('Enums', () => {
	it('should have the correct values for ResponseType', () => {
		expect(ResponseType.Success).toBe('success');
		expect(ResponseType.ClientError).toBe('clientError');
		expect(ResponseType.ServerError).toBe('serverError');
	});

	it('should have the correct values for SuccessCode', () => {
		expect(SuccessCode.Ok).toBe(200);
		expect(SuccessCode.Created).toBe(201);
	});

	it('should have the correct values for ClientErrorCode', () => {
		expect(ClientErrorCode.BadRequest).toBe(400);
		expect(ClientErrorCode.Unauthorized).toBe(401);
		expect(ClientErrorCode.Forbidden).toBe(403);
		expect(ClientErrorCode.NotFound).toBe(404);
		expect(ClientErrorCode.MethodNotAllowed).toBe(405);
		expect(ClientErrorCode.Conflict).toBe(409);
	});

	it('should have the correct values for ServerErrorCode', () => {
		expect(ServerErrorCode.InternalServerError).toBe(500);
		expect(ServerErrorCode.NotImplemented).toBe(501);
		expect(ServerErrorCode.BadGateway).toBe(502);
		expect(ServerErrorCode.ServiceUnavailable).toBe(503);
		expect(ServerErrorCode.GatewayTimeout).toBe(504);
	});

	it('should have the correct values for HttpMethod', () => {
		expect(HttpMethod.Get).toBe('GET');
		expect(HttpMethod.Post).toBe('POST');
		expect(HttpMethod.Patch).toBe('PATCH');
		expect(HttpMethod.Delete).toBe('DELETE');
	});

	// Additional tests of the enums
	it('should have the correct number of values for ResponseType', () => {
		expect(Object.keys(ResponseType).length).toBe(3);
	});

	it('should have the correct number of values for SuccessCode', () => {
		expect(Object.keys(SuccessCode).length).toBe(4);
	});

	it('should have the correct number of values for ClientErrorCode', () => {
		expect(Object.keys(ClientErrorCode).length).toBe(12);
	});

	it('should have the correct number of values for ServerErrorCode', () => {
		expect(Object.keys(ServerErrorCode).length).toBe(10);
	});

	it('should have the correct number of values for HttpMethod', () => {
		expect(Object.keys(HttpMethod).length).toBe(4);
	});
});
