import { useEffect, useState } from 'react';

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
