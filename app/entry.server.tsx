/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { NewUser } from '@database/types';
import type { AppLoadContext, EntryContext } from '@remix-run/node';

import { PassThrough } from 'node:stream';

import { database, eq, or, schema } from '@database';
import {
	MissingEnvironmentVariableError,
	MissingEnvironmentVariablesError,
} from '@errors/shared';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { createUser } from '@services/server/users';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';

const ABORT_DELAY = 5_000;

/**
 * Builds a new admin user object using environment variables.
 *
 * @returns {NewUser} The new admin user object.
 * @throws {MissingEnvironmentVariablesError} If any of the required environment variables
 * (ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD) are missing.
 */
function buildAdminUser(): NewUser {
	const username = process.env.ADMIN_USERNAME;
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!username || !email || !password) {
		const errors: string[] = [];

		if (!username) {
			errors.push('ADMIN_USERNAME');
		}
		if (!email) {
			errors.push('ADMIN_EMAIL');
		}
		if (!password) {
			errors.push('ADMIN_PASSWORD');
		}

		throw new MissingEnvironmentVariablesError(errors);
	}

	return {
		role: 'admin',
		name: 'Admin',
		username: username,
		email: email,
		password: password,
	};
}

/**
 * Creates a new user object with admin role.
 *
 * @returns {NewUser} A new user object with the role set to 'admin',
 *                    a predefined name, username, email, and a randomly generated password.
 */
function buildAdminKeyUser(): NewUser {
	return {
		role: 'admin',
		name: 'Admin Key',
		username: 'x-admin-key',
		email: 'noemail@escuelaing.com',
		password: Math.random().toString(36).substring(2),
	};
}

/**
 * This self-invoking async function checks if the admin user exists in the database.
 * If the admin user does not exist, it creates a new admin user.
 * If the admin key user does not exist, it creates a new admin key user.
 */
(async () => {
	const users = await database
		.select()
		.from(schema.users)
		.where(
			or(
				eq(schema.users.username, 'admin'),
				eq(schema.users.username, 'x-admin-key'),
			),
		);

	const adminUser = users.find((user) => user.username === 'admin');
	const adminKeyUser = users.find((user) => user.username === 'x-admin-key');

	if (!adminUser) {
		console.log('Creating admin user');

		createUser({ request: buildAdminUser() })
			.then(() => {
				console.log('Admin user created');
			})
			.catch((error) => {
				console.error('Error creating admin user', error);
				process.exit(1);
			});
	}

	if (!adminKeyUser) {
		console.log('Creating admin key user');

		createUser({ request: buildAdminKeyUser() })
			.then(() => {
				console.log('Admin Key user created');
			})
			.catch((error) => {
				console.error('Error creating admin key user', error);
				process.exit(1);
			});
	}
})();

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	// This is ignored so we can keep it in the template for visibility.  Feel
	// free to delete this parameter in your app if you're not using it!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	loadContext: AppLoadContext,
) {
	return isbot(request.headers.get('user-agent') || '')
		? handleBotRequest(
				request,
				responseStatusCode,
				responseHeaders,
				remixContext,
			)
		: handleBrowserRequest(
				request,
				responseStatusCode,
				responseHeaders,
				remixContext,
			);
}

function handleBotRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const { pipe, abort } = renderToPipeableStream(
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>,
			{
				onAllReady() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set('Content-Type', 'text/html');

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}

function handleBrowserRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const { pipe, abort } = renderToPipeableStream(
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>,
			{
				onShellReady() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set('Content-Type', 'text/html');

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
