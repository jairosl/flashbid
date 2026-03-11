import { Elysia } from 'elysia';
import { AppError } from '@/modules/common/errors';
import type { ApiResponse } from '@/modules/common/types';

export const errorPlugin = new Elysia({
	name: 'error-plugin',
}).onError(({ error, set }): ApiResponse<never> => {
	if (error instanceof AppError) {
		set.status = error.statusCode;
		return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details,
			},
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
			success: false,
			error: {
				code: anyError.code,
				message: anyError.message ?? String(error),
			},
		};
	}

	set.status = 500;
	return {
		success: false,
		error: {
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Internal server error',
		},
	};
});
