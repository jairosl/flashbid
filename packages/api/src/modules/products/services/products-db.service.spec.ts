import 'reflect-metadata';
import { Container } from 'inversify';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { TYPES } from '@/lib/di/types';
import type { StorageService } from '@/modules/storage/services/storage.service';
import { ProductsError } from '../errors/products-error';
import type { ProductsRepository } from '../repositories/products.repository';
import { ProductsDbService } from './products-db.service';

describe('ProductsDbService', () => {
	let service: ProductsDbService;
	let mockRepository: Record<keyof ProductsRepository, Mock>;
	let mockStorageService: Record<keyof StorageService, Mock>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockRepository = {
			create: vi.fn(),
			findAll: vi.fn(),
			findById: vi.fn(),
			countByOwnerId: vi.fn(),
		};

		mockStorageService = {
			uploadFile: vi.fn(),
			deleteFile: vi.fn(),
			getPublicUrl: vi.fn(),
		};

		const container = new Container();
		container
			.bind<ProductsRepository>(TYPES.ProductsRepository)
			.toConstantValue(mockRepository as unknown as ProductsRepository);
		container
			.bind<StorageService>(TYPES.StorageService)
			.toConstantValue(mockStorageService as unknown as StorageService);
		container.bind(ProductsDbService).to(ProductsDbService);

		service = container.get(ProductsDbService);
	});

	describe('create', () => {
		it('should create a product without image if no image is provided', async () => {
			mockRepository.countByOwnerId.mockResolvedValue(0);
			const mockProduct = { id: 'new-id', name: 'Test Product' };
			mockRepository.create.mockResolvedValue(mockProduct);

			const result = await service.create('user-1', { name: 'Test Product' });

			expect(result).toEqual(mockProduct);
			expect(mockStorageService.uploadFile).not.toHaveBeenCalled();
			expect(mockRepository.create).toHaveBeenCalledWith('user-1', {
				name: 'Test Product',
				description: undefined,
				imageId: undefined,
			});
		});

		it('should upload image and create product with imageId if image is provided', async () => {
			mockRepository.countByOwnerId.mockResolvedValue(0);
			const mockProduct = {
				id: 'new-id',
				name: 'Test Product',
				imageId: 'img-123',
			};
			mockRepository.create.mockResolvedValue(mockProduct);

			const mockImage = new Blob([''], { type: 'image/png' });
			mockStorageService.uploadFile.mockResolvedValue({
				imageId: 'img-123',
				url: 'http://example.com/img.png',
			});

			const result = await service.create('user-1', {
				name: 'Test Product',
				image: mockImage as any,
			});

			expect(result).toEqual(mockProduct);
			expect(mockStorageService.uploadFile).toHaveBeenCalledWith(mockImage, {
				ownerId: 'user-1',
			});
			expect(mockRepository.create).toHaveBeenCalledWith('user-1', {
				name: 'Test Product',
				description: undefined,
				imageId: 'img-123',
			});
		});

		it('should throw ProductsError if the user already has 5 products', async () => {
			mockRepository.countByOwnerId.mockResolvedValue(5);

			await expect(
				service.create('user-1', { name: 'Too many' }),
			).rejects.toThrow(ProductsError);
		});
	});
});
