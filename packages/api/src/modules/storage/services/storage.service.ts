import type { UploadFileResponseDto } from '../dto';
import type { UploadOptions } from '../types';

/**
 * Abstract Storage Service
 * Permite trocar implementação (Supabase, S3, Cloudinary, etc) facilmente
 */
export abstract class StorageService {
	/**
	 * Faz upload de um arquivo
	 */
	abstract uploadFile(
		file: File | Blob,
		options?: UploadOptions,
	): Promise<UploadFileResponseDto>;

	/**
	 * Deleta um arquivo
	 */
	abstract deleteFile(imageId: string, ownerId: string): Promise<void>;

	/**
	 * Obtém URL pública de um arquivo
	 */
	abstract getPublicUrl(filePath: string): string;

	/**
	 * Extrai extensão do arquivo
	 */
	protected getFileExtension(file: File | Blob): string {
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
	protected getContentType(file: File | Blob): string {
		return file.type || 'application/octet-stream';
	}
}
