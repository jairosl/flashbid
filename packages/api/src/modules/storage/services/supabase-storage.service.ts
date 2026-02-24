import { randomUUIDv7 } from 'bun';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/database/drizzle/client';
import { image } from '@/lib/database/drizzle/schema';
import { StorageError } from '@/modules/common/errors';
import { STORAGE_BUCKET, supabase } from '../client';
import type { UploadFileResponseDto } from '../dto';
import type { UploadOptions } from '../types';
import { StorageService } from './storage.service';

/**
 * Implementação do StorageService usando Supabase Storage
 */
export class SupabaseStorageService extends StorageService {
	async uploadFile(
		file: File | Blob,
		options: UploadOptions = {},
	): Promise<UploadFileResponseDto> {
		try {
			if (!options.ownerId) {
				throw new StorageError(
					'Missing ownerId for image persistence',
					'OWNER_ID_REQUIRED',
					400,
				);
			}

			// Gerar nome único para o arquivo
			const fileExtension = this.getFileExtension(file);
			const uniqueFileName = `${randomUUIDv7()}${fileExtension}`;

			// Construir path completo
			const folder = options.folder || 'uploads';
			const filePath = `${folder}/${uniqueFileName}`;

			// Upload para Supabase
			const { data, error } = await supabase.storage
				.from(STORAGE_BUCKET)
				.upload(filePath, file, {
					upsert: options.upsert ?? false,
					contentType: options.contentType || this.getContentType(file),
				});

			if (error) {
				throw new StorageError(
					`Failed to upload file: ${error.message}`,
					'UPLOAD_FAILED',
					400,
					error,
				);
			}

			// Obter URL pública
			const { data: urlData } = supabase.storage
				.from(STORAGE_BUCKET)
				.getPublicUrl(data.path);

			const [imageRecord] = await db
				.insert(image)
				.values({
					url: data.path,
					urlPublic: urlData.publicUrl,
					sizeBytes: file.size,
					ownerId: options.ownerId,
				})
				.returning();

			return {
				url: urlData.publicUrl,
				path: data.path,
				fullPath: data.fullPath,
				imageId: imageRecord.id,
			};
		} catch (error) {
			if (error instanceof StorageError) {
				throw error;
			}
			throw new StorageError(
				'Unexpected error during file upload',
				'UPLOAD_ERROR',
				500,
				error,
			);
		}
	}

	async deleteFile(imageId: string, ownerId: string): Promise<void> {
		const [imageRecord] = await db
			.select({
				id: image.id,
				path: image.url,
			})
			.from(image)
			.where(and(eq(image.id, imageId), eq(image.ownerId, ownerId)));

		if (!imageRecord) {
			throw new StorageError('Image not found', 'IMAGE_NOT_FOUND', 404);
		}

		const { error } = await supabase.storage
			.from(STORAGE_BUCKET)
			.remove([imageRecord.path]);

		if (error) {
			throw new StorageError(
				`Failed to delete file: ${error.message}`,
				'DELETE_FAILED',
				400,
				error,
			);
		}

		await db.delete(image).where(eq(image.id, imageRecord.id));
	}

	getPublicUrl(filePath: string): string {
		const { data } = supabase.storage
			.from(STORAGE_BUCKET)
			.getPublicUrl(filePath);

		return data.publicUrl;
	}
}
