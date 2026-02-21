import { AppError } from './app-error';

/**
 * Erro quando recurso não é encontrado
 */
export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found', details?: unknown) {
		super(message, 'NOT_FOUND', 404, details);
	}
}

