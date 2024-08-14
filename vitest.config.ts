import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			include: ['app/**/*.ts'],
			reporter: ['html', 'text'],
		},
		setupFiles: ['dotenv/config'],
	},
	plugins: [tsconfigPaths()],
});
