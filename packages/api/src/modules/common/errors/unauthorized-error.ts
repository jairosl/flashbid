import { AppError } from './app-error';

/**
 * Erro de autenticação/autorização
 */
export class UnauthorizedError extends AppError {
	constructor(
		message: string = 'Unauthorized',
		details?: unknown,
	) {
		super(message, 'UNAUTHORIZED', 401, details);
	}
}
