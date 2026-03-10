import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		name: 'api',
		environment: 'node',
		pool: 'forks',
		include: ['src/**/*.spec.ts'],
		env: {
			SUPABASE_URL_PROJECT: 'https://fake.supabase.co',
			SUPABASE_API_KEY_SECRET: 'fake-key',
			SUPABASE_BUCKET: 'test-bucket',
		},
	},
});
