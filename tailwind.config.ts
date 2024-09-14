import type { Config } from 'tailwindcss';

import { nextui } from '@nextui-org/theme';
import container from '@tailwindcss/container-queries';

export default {
	content: [
		'./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}',
		'./node_modules/@nextui-org/theme/dist/components/(button|chip|divider|input|link|pagination|spinner|table|ripple|checkbox|spacer).js',
	],
	theme: {
		extend: {},
	},
	plugins: [
		nextui({
			defaultTheme: 'light',
		}),
		container,
	],
	darkMode: 'class',
} satisfies Config;
