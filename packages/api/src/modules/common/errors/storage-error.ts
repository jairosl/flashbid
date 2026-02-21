import { AppError } from './app-error';

/**
 * Erro relacionado a operações de storage
 */
export class StorageError extends AppError {
	constructor(
		message: string,
		code: string = 'STORAGE_ERROR',
		statusCode: number = 500,
		details?: unknown,
	) {
		super(message, code, statusCode, details);
	}
}

/**
 * Erro de validação de arquivo
 */
export class FileValidationError extends StorageError {
	constructor(message: string, details?: unknown) {
		super(message, 'FILE_VALIDATION_ERROR', 400, details);
	}
}

/**
 * Erro de upload
 */
export class UploadError extends StorageError {
	constructor(message: string, details?: unknown) {
		super(message, 'UPLOAD_ERROR', 500, details);
	}
}

/**
 * Erro ao deletar arquivo
 */
export class DeleteError extends StorageError {
	constructor(message: string, details?: unknown) {
		super(message, 'DELETE_ERROR', 500, details);
	}
}
