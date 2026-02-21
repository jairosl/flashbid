import { AppError } from './app-error';

/**
 * Erro de validação de dados
 */
export class ValidationError extends AppError {
	constructor(message: string, details?: unknown) {
		super(message, 'VALIDATION_ERROR', 400, details);
	}
}
