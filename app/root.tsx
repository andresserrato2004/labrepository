import type React from 'react';

import { NextUIProvider } from '@nextui-org/system';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
} from '@remix-run/react';

import './tailwind.css';

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<NextUIProvider validationBehavior='native'>
					{children}
				</NextUIProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	const logId = isRouteErrorResponse(error) ? error.data : 'unknown';

	return (
		<main className='w-dvw h-dvh grid place-content-center bg-content1 gap-8 justify-items-center dark'>
			<h1 className='text-3xl sm:text-5xl font-bold text-content1-foreground'>
				Error ocurred 🚨
			</h1>
			<p className='max-w-xs sm:max-w-sm text-center text-content1-foreground'>
				Unknown server error ocurred with log ID:&nbsp;
				<span className='text-danger font-bold'>{logId}</span>. Please
				try again later or call support.
			</p>
		</main>
	);
}

export default function App() {
	return <Outlet />;
}
