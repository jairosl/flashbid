/** biome-ignore-all lint/suspicious/noExplicitAny: test file */
import 'reflect-metadata';
import { Container } from 'inversify';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { TYPES } from '@/lib/di/types';
import type { ProductsService } from '../services/products.service';
import { ProductsController } from './index';

describe('ProductsController', () => {
	let controller: ProductsController;
	let mockService: Record<keyof ProductsService, Mock>;

	beforeEach(() => {
		mockService = {
			create: vi.fn(),
			list: vi.fn(),
			getById: vi.fn(),
		};

		const container = new Container();
		container
			.bind<ProductsService>(TYPES.ProductsService)
			.toConstantValue(mockService as unknown as ProductsService);
		container.bind(ProductsController).to(ProductsController);

		controller = container.get(ProductsController);
	});

	describe('create', () => {
		it('should create a product and return success', async () => {
			const mockProduct = { id: '1', name: 'Product' } as any;
			mockService.create.mockResolvedValue(mockProduct);

			const response = await controller.create({
				user: { id: 'user-1' },
				body: { name: 'Product' },
				params: {},
				query: {},
			} as any);

			expect(response).toEqual({
				success: true,
				data: mockProduct,
			});
			expect(mockService.create).toHaveBeenCalledWith('user-1', {
				name: 'Product',
			});
		});
	});

	describe('list', () => {
		it('should return a list of products', async () => {
			const mockProducts = [{ id: '1', name: 'Product' }] as any;
			mockService.list.mockResolvedValue(mockProducts);

			const response = await controller.list();

			expect(response).toEqual({
				success: true,
				data: mockProducts,
			});
		});
	});

	describe('getById', () => {
		it('should return a product by id', async () => {
			const mockProduct = { id: '1', name: 'Product' } as any;
			mockService.getById.mockResolvedValue(mockProduct);

			const response = await controller.getById({
				params: { id: '1' },
				body: {},
				query: {},
			} as any);

			expect(response).toEqual({
				success: true,
				data: mockProduct,
			});
		});
	});
});
