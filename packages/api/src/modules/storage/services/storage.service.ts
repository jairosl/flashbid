import type { UploadFileResponseDto } from '../dto';
import type { UploadOptions } from '../types';

/**
 * Contrato do Storage Service
 * Permite trocar implementação (Supabase, S3, Cloudinary, etc) facilmente
 */
export interface StorageService {
	/**
	 * Faz upload de um arquivo
	 */
	uploadFile(
		file: File | Blob,
		options?: UploadOptions,
	): Promise<UploadFileResponseDto>;

	/**
	 * Deleta um arquivo
	 */
	deleteFile(imageId: string, ownerId: string): Promise<void>;

	/**
	 * Obtém URL pública de um arquivo
	 */
	getPublicUrl(filePath: string): string;
}

/**
 * Helper com métodos estáticos utilitários de storage
 */
export class StorageUtils {
	/**
	 * Extrai extensão do arquivo
	 */
	static getFileExtension(file: File | Blob): string {
		if (file instanceof File && file.name) {
			const parts = file.name.split('.');
			return parts.length > 1 ? `.${parts.pop()}` : '';
		}

		// Fallback baseado no MIME type
		const mimeType = file.type;
		const extension = mimeType.split('/')[1];
		return extension ? `.${extension}` : '';
	}

	/**
	 * Obtém content type do arquivo
	 */
	static getContentType(file: File | Blob): string {
		return file.type || 'application/octet-stream';
	}
}
