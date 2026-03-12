import { logger } from '@/lib/logger';
import { AppError } from '@/modules/common/errors';
import type { ApiResponse } from '@/modules/common/types';

/** biome-ignore lint/suspicious/noExplicitAny: error types are varied from Elysia */
export const errorHandler = ({ error, set, code }: any): ApiResponse<never> => {
	// Debug: Logar o tipo do erro e propriedades para entender por que cai no 500
	logger.debug(`Error caught by handler: [${code}] - ${error.name}`, {
		name: error.name,
		message: error.message,
		// @ts-ignore - checking for potential properties
		statusCode: error?.statusCode || error?.status,
		// @ts-ignore
		errorCode: error?.code,
	});

	// 1. Handle Elysia Validation Errors
	if (code === 'VALIDATION') {
		const validationError = error as {
			all?: Array<{ path: string; message: string; summary?: string }>;
		};

		const details = validationError.all?.map((err) => ({
			path: err.path,
			message: err.summary || err.message,
		}));

		logger.warn('Validation Error', { details });

		set.status = 400;
		return {
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: 'Invalid request data',
				details,
			},
		};
	}

	// 2. Handle Application Errors (AppError ou qualquer erro com statusCode/code)
	// @ts-ignore
	const errorStatusCode = error?.statusCode || error?.status;
	// @ts-ignore
	const errorCode =
		error?.code || (error instanceof AppError ? error.code : undefined);

	if (errorStatusCode || errorCode) {
		const finalStatus = errorStatusCode || 400;
		const finalCode = errorCode || 'APP_ERROR';

		logger.warn(`Handled AppError [${finalCode}]: ${error.message}`, {
			code: finalCode,
			statusCode: finalStatus,
		});

		set.status = finalStatus;
		return {
			success: false,
			error: {
				code: finalCode,
				message: error.message,
				details: error?.details,
			},
		};
	}

	const anyError = error as {
		code?: string;
		status?: number;
		message?: string;
	};

	if (anyError?.code && anyError?.status) {
		logger.warn(`Handled Error: ${anyError.message}`, {
			code: anyError.code,
			status: anyError.status,
		});

		set.status = anyError.status;
		return {
			success: false,
			error: {
				code: anyError.code,
				message: anyError.message ?? String(error),
			},
		};
	}

	const errorMessage = error instanceof Error ? error.message : String(error);
	logger.error(`Unexpected Internal Server Error: ${errorMessage}`);

	set.status = 500;
	return {
		success: false,
		error: {
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Internal server error',
		},
	};
};
