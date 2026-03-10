import 'reflect-metadata';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Container } from 'inversify';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { TYPES } from '@/lib/di/types';
import { StorageError } from '@/modules/common/errors';
import type { ImageRecord, ImagesRepository } from '../repositories';
import { SupabaseStorageService } from './supabase-storage.service';

// 1. Module Mocks (Necessary to prevent side effects from static imports)
vi.mock('bun', () => ({
	randomUUIDv7: vi.fn(() => 'test-uuid-123'),
}));

vi.mock('@/modules/storage/client', () => ({
	supabase: {},
	STORAGE_BUCKET: 'test-bucket',
}));

describe('SupabaseStorageService', () => {
	let service: SupabaseStorageService;
	let container: Container;

	// Strictly typed mocks
	const mockImagesRepository = {
		findByIdAndOwner: vi.fn(),
		create: vi.fn(),
		delete: vi.fn(),
	} satisfies Record<keyof ImagesRepository, Mock>;

	const mockStorageChain = {
		upload: vi.fn(),
		remove: vi.fn(),
		getPublicUrl: vi.fn(),
	};

	const mockSupabaseClient = {
		storage: {
			from: vi.fn().mockReturnValue(mockStorageChain),
		},
	} as unknown as SupabaseClient;

	beforeEach(() => {
		vi.clearAllMocks();

		// Setting up the DI Container for tests
		container = new Container();

		container
			.bind<ImagesRepository>(TYPES.ImagesRepository)
			.toConstantValue(mockImagesRepository as unknown as ImagesRepository);

		container
			.bind<SupabaseClient>(TYPES.SupabaseClient)
			.toConstantValue(mockSupabaseClient);

		container
			.bind<SupabaseStorageService>(TYPES.StorageService)
			.to(SupabaseStorageService);

		// Resolving the service through the container (DI in action)
		service = container.get<SupabaseStorageService>(TYPES.StorageService);
	});

	it('should throw StorageError if ownerId is missing', async () => {
		const file = new File([''], 'test.png', { type: 'image/png' });

		await expect(service.uploadFile(file, {})).rejects.toThrow(StorageError);
	});

	it('should upload a file successfully and register it in the repository', async () => {
		const file = new File(['content'], 'test.png', { type: 'image/png' });

		mockStorageChain.upload.mockResolvedValue({
			data: { path: 'path/to/img.png' },
			error: null,
		});

		mockStorageChain.getPublicUrl.mockReturnValue({
			data: { publicUrl: 'http://cdn.com/img.png' },
		});

		const mockRecord = {
			id: 'db-id-123',
			urlPublic: 'http://cdn.com/img.png',
		} as ImageRecord;

		mockImagesRepository.create.mockResolvedValue(mockRecord);

		const result = await service.uploadFile(file, { ownerId: 'user-1' });

		expect(result.imageId).toBe('db-id-123');
		expect(mockStorageChain.upload).toHaveBeenCalled();
		expect(mockImagesRepository.create).toHaveBeenCalled();
	});

	it('should propagate storage upload errors', async () => {
		const file = new File([''], 'test.png', { type: 'image/png' });

		mockStorageChain.upload.mockResolvedValue({
			data: null,
			error: { message: 'Bucket access denied' },
		});

		await expect(
			service.uploadFile(file, { ownerId: 'any' }),
		).rejects.toMatchObject({
			code: 'UPLOAD_FAILED',
		});
	});

	it('should delete a file from storage if the image is found', async () => {
		const mockRecord = {
			id: 'img-1',
			url: 'img-path.png',
		} as ImageRecord;

		mockImagesRepository.findByIdAndOwner.mockResolvedValue(mockRecord);
		mockStorageChain.remove.mockResolvedValue({ error: null });
		mockImagesRepository.delete.mockResolvedValue(undefined);

		await service.deleteFile('img-1', 'owner-1');

		expect(mockStorageChain.remove).toHaveBeenCalledWith(['img-path.png']);
		expect(mockImagesRepository.delete).toHaveBeenCalledWith('img-1');
	});
});
