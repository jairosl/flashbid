import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './src/lib/database/drizzle/migrations',
	schema: './src/lib/database/drizzle/schema/**',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	casing: 'snake_case',
});
