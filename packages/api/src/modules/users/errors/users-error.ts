import { AppError } from '@/modules/common/errors';

export class UsersError extends AppError {
	constructor(
		message: string,
		code: string = 'USERS_ERROR',
		statusCode: number = 400,
		details?: unknown,
	) {
		super(message, code, statusCode, details);
	}
}
