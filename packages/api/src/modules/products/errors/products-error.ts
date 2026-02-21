import { AppError } from '@/modules/common/errors';

export class ProductsError extends AppError {
	constructor(
		message: string,
		code: string = 'PRODUCTS_ERROR',
		statusCode: number = 400,
		details?: unknown,
	) {
		super(message, code, statusCode, details);
	}
}
