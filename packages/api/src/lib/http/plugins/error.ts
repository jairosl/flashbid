import { Elysia } from 'elysia';
import { AppError } from '@/modules/common/errors';

export const errorPlugin = new Elysia({
	name: 'error-plugin',
}).onError(({ error, set }) => {
	if (error instanceof AppError) {
		set.status = error.statusCode;
		return {
			code: error.code,
			message: error.message,
		};
	}

	const anyError = error as {
		code?: string;
		status?: number;
		message?: string;
	};

	if (anyError?.code && anyError?.status) {
		set.status = anyError.status;
		return {
			code: anyError.code,
			message: anyError.message ?? String(error),
		};
	}

	set.status = 500;
	return {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Internal server error',
	};
});
