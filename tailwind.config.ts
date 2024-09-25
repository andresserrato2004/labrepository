import type { Config } from 'tailwindcss';

import { nextui } from '@nextui-org/theme';
import container from '@tailwindcss/container-queries';

export default {
	content: [
		'./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}',
		'./node_modules/@nextui-org/theme/dist/components/(autocomplete|button|chip|divider|dropdown|input|link|modal|pagination|spinner|table|ripple|listbox|popover|scroll-shadow|menu|checkbox|spacer).js',
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
