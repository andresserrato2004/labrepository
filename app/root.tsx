import type React from 'react';

import { Link } from '@nextui-org/link';
import { NextUIProvider } from '@nextui-org/system';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useNavigate,
	useRouteError,
} from '@remix-run/react';
import { Toaster } from 'sonner';

import './tailwind.css';

export function Layout({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();

	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				{/* TODO: Download static font instead of using it from google fonts */}
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' />
				<link
					href='https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
					rel='stylesheet'
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<Toaster position='top-center' />
				<NextUIProvider validationBehavior='native' navigate={navigate}>
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

	const handleGoBack = (event: React.MouseEvent) => {
		event.preventDefault();
		/**
		 * Redirects to the home page when the user clicks the "Go back to home" link.
		 * It uses the window object to navigate to the home page instead of using the `navigate` function
		 * because we need a full page reload to reset the application state.
		 */
		window.location.href = '/';
	};

	return (
		<main className='w-dvw h-dvh grid place-content-center bg-content1 gap-8 justify-items-center dark'>
			<h1 className='text-3xl sm:text-5xl font-bold text-content1-foreground'>
				Error ocurred 🚨
			</h1>
			<p className='max-w-xs sm:max-w-sm text-center text-content1-foreground'>
				Unknown server error ocurred with log ID:&nbsp;
				<span className='text-danger font-bold'>{logId}</span>. Please
				try again later or call support.&nbsp;
				<Link className='underline' href='/' onClick={handleGoBack}>
					Go back to home
				</Link>
			</p>
		</main>
	);
}

export default function App() {
	return <Outlet />;
}
