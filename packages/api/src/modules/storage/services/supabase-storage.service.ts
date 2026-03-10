import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUIDv7 } from 'bun';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import { StorageError } from '@/modules/common/errors';
import { STORAGE_BUCKET } from '../client';
import type { UploadFileResponseDto } from '../dto';
import type { ImagesRepository } from '../repositories';
import type { UploadOptions } from '../types';
import { type StorageService, StorageUtils } from './storage.service';

/**
 * Implementação do StorageService usando Supabase Storage.
 */
@injectable()
export class SupabaseStorageService implements StorageService {
	constructor(
		@inject(TYPES.ImagesRepository)
		private readonly imagesRepository: ImagesRepository,
		@inject(TYPES.SupabaseClient)
		private readonly supabase: SupabaseClient,
	) {}

	async uploadFile(
		file: File | Blob,
		options: UploadOptions = {},
	): Promise<UploadFileResponseDto> {
		if (!options.ownerId) {
			throw new StorageError(
				'Missing ownerId for image persistence',
				'OWNER_ID_REQUIRED',
				400,
			);
		}

		// Gerar nome único para o arquivo
		const fileExtension = StorageUtils.getFileExtension(file);
		const uniqueFileName = `${randomUUIDv7()}${fileExtension}`;

		// Construir path completo
		const folder = options.folder || 'uploads';
		const filePath = `${folder}/${uniqueFileName}`;

		// Upload para Supabase
		const { data, error } = await this.supabase.storage
			.from(STORAGE_BUCKET)
			.upload(filePath, file, {
				upsert: options.upsert ?? false,
				contentType: options.contentType || StorageUtils.getContentType(file),
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
		const { data: urlData } = this.supabase.storage
			.from(STORAGE_BUCKET)
			.getPublicUrl(data.path);

		const imageRecord = await this.imagesRepository.create({
			url: data.path,
			urlPublic: urlData.publicUrl,
			sizeBytes: file.size,
			ownerId: options.ownerId,
		});

		return {
			url: urlData.publicUrl,
			path: data.path,
			fullPath: data.fullPath,
			imageId: imageRecord.id,
		};
	}

	async deleteFile(imageId: string, ownerId: string): Promise<void> {
		const imageRecord = await this.imagesRepository.findByIdAndOwner(
			imageId,
			ownerId,
		);

		if (!imageRecord) {
			throw new StorageError('Image not found', 'IMAGE_NOT_FOUND', 404);
		}

		const { error } = await this.supabase.storage
			.from(STORAGE_BUCKET)
			.remove([imageRecord.url]);

		if (error) {
			throw new StorageError(
				`Failed to delete file: ${error.message}`,
				'DELETE_FAILED',
				400,
				error,
			);
		}

		await this.imagesRepository.delete(imageId);
	}

	getPublicUrl(filePath: string): string {
		const { data } = this.supabase.storage
			.from(STORAGE_BUCKET)
			.getPublicUrl(filePath);

		return data.publicUrl;
	}
}
