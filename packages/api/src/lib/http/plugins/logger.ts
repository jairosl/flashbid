import { logger } from 'elysia-logger';

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;

export const loggerPlugin = logger({
	// biome-ignore lint/suspicious/noExplicitAny: Cast to accept 'silent'
	level: (isTest ? 'silent' : 'info') as any,
	transport:
		process.env.NODE_ENV !== 'production' && !isTest ? 'console' : undefined,
});
