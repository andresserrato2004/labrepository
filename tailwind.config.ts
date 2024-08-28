import type { Config } from 'tailwindcss';

import { nextui } from '@nextui-org/theme';

export default {
	content: [
		'./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}',
		'./node_modules/@nextui-org/theme/dist/components/(button|divider|input|link|ripple|spinner).js',
	],
	theme: {
		extend: {},
	},
	plugins: [
		nextui({
			defaultTheme: 'light',
		}),
	],
	darkMode: 'class',
} satisfies Config;
