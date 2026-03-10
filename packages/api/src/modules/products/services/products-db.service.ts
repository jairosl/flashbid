import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import type { StorageService } from '@/modules/storage/services/storage.service';
import { ProductsError } from '../errors/products-error';
import type { ProductsRepository } from '../repositories/products.repository';
import type { CreateProductData, Product } from '../types';
import type { ProductsService } from './products.service';

/**
 * Implementation of ProductsService
 */
@injectable()
export class ProductsDbService implements ProductsService {
	private readonly MAX_PRODUCTS_PER_USER = 5;

	constructor(
		@inject(TYPES.ProductsRepository)
		private productsRepository: ProductsRepository,
		@inject(TYPES.StorageService)
		private storageService: StorageService,
	) {}

	async create(ownerId: string, data: CreateProductData): Promise<Product> {
		// Check user's product count
		const userProductsCount =
			await this.productsRepository.countByOwnerId(ownerId);

		if (userProductsCount >= this.MAX_PRODUCTS_PER_USER) {
			throw new ProductsError(
				`Maximum product limit (${this.MAX_PRODUCTS_PER_USER}) reached`,
				'PRODUCT_LIMIT_REACHED',
				403,
			);
		}

		let imageId: string | undefined;

		// Handle image upload if present
		if (data.image) {
			const uploadResult = await this.storageService.uploadFile(data.image, {
				ownerId,
			});
			imageId = uploadResult.imageId;
		}

		return this.productsRepository.create(ownerId, {
			name: data.name,
			description: data.description,
			imageId,
		});
	}

	async list(): Promise<Product[]> {
		return this.productsRepository.findAll();
	}

	async getById(id: string): Promise<Product | null> {
		return this.productsRepository.findById(id);
	}
}
