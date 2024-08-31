import { useEffect, useState } from 'react';

/**
 * Custom hook that returns the current window size and a flag indicating if the window is considered mobile.
 * @returns An object containing the width and height of the window, and a boolean indicating if the window is mobile.
 */
export function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0,
	});

	const isMobile = windowSize.width < 1024;

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);

		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return {
		width: windowSize.width,
		height: windowSize.height,
		isMobile: isMobile,
	};
}
