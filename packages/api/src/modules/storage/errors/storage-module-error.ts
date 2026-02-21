import { StorageError } from '@/modules/common/errors';

export class StorageModuleError extends StorageError {
	constructor(
		message: string,
		code: string = 'STORAGE_MODULE_ERROR',
		statusCode: number = 400,
		details?: unknown,
	) {
		super(message, code, statusCode, details);
	}
}
