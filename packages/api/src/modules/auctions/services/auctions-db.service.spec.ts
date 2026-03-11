import 'reflect-metadata';
import { Container } from 'inversify';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { TYPES } from '@/lib/di/types';
import type { ProductsService } from '@/modules/products/services/products.service';
import { AuctionsError } from '../errors/auctions-error';
import type { AuctionsRepository } from '../repositories/auctions.repository';
import { AuctionStatus } from '../types';
import { AuctionsDbService } from './auctions-db.service';

describe('AuctionsDbService', () => {
	let service: AuctionsDbService;
	let mockAuctionsRepository: Record<keyof AuctionsRepository, Mock>;
	let mockProductsService: Record<keyof ProductsService, Mock>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockAuctionsRepository = {
			create: vi.fn(),
			findAll: vi.fn(),
			findById: vi.fn(),
			findActiveByProductId: vi.fn(),
		};

		mockProductsService = {
			create: vi.fn(),
			list: vi.fn(),
			getById: vi.fn(),
		};

		const container = new Container();
		container
			.bind<AuctionsRepository>(TYPES.AuctionsRepository)
			.toConstantValue(mockAuctionsRepository as unknown as AuctionsRepository);
		container
			.bind<ProductsService>(TYPES.ProductsService)
			.toConstantValue(mockProductsService as unknown as ProductsService);
		container.bind(AuctionsDbService).to(AuctionsDbService);

		service = container.get(AuctionsDbService);
	});

	describe('create', () => {
		const sellerId = 'user-1';
		const createData = {
			productId: 'prod-1',
			startPrice: 100,
			startsAt: new Date(Date.now() + 10000),
			endsAt: new Date(Date.now() + 20000),
		};

		it('should create an auction successfully', async () => {
			mockProductsService.getById.mockResolvedValue({
				id: 'prod-1',
				ownerId: sellerId,
			});
			mockAuctionsRepository.findActiveByProductId.mockResolvedValue(null);
			const mockAuction = {
				id: 'auc-1',
				...createData,
				sellerId,
				status: AuctionStatus.PENDING,
			};
			mockAuctionsRepository.create.mockResolvedValue(mockAuction);

			const result = await service.create(sellerId, createData);

			expect(result).toEqual(mockAuction);
			expect(mockAuctionsRepository.create).toHaveBeenCalledWith(
				sellerId,
				createData,
			);
		});

		it('should throw error if product does not exist', async () => {
			mockProductsService.getById.mockResolvedValue(null);

			await expect(service.create(sellerId, createData)).rejects.toThrow(
				AuctionsError,
			);
			await expect(service.create(sellerId, createData)).rejects.toThrow(
				'Product not found',
			);
		});

		it('should throw error if seller does not own the product', async () => {
			mockProductsService.getById.mockResolvedValue({
				id: 'prod-1',
				ownerId: 'different-user',
			});

			await expect(service.create(sellerId, createData)).rejects.toThrow(
				AuctionsError,
			);
			await expect(service.create(sellerId, createData)).rejects.toThrow(
				'You do not own this product',
			);
		});

		it('should throw error if an active auction already exists for the product', async () => {
			mockProductsService.getById.mockResolvedValue({
				id: 'prod-1',
				ownerId: sellerId,
			});
			mockAuctionsRepository.findActiveByProductId.mockResolvedValue({
				id: 'existing-auc',
			});

			await expect(service.create(sellerId, createData)).rejects.toThrow(
				AuctionsError,
			);
			await expect(service.create(sellerId, createData)).rejects.toThrow(
				'There is already an active or pending auction for this product',
			);
		});

		it('should throw error if start date is after end date', async () => {
			mockProductsService.getById.mockResolvedValue({
				id: 'prod-1',
				ownerId: sellerId,
			});
			mockAuctionsRepository.findActiveByProductId.mockResolvedValue(null);

			const invalidDates = {
				...createData,
				startsAt: new Date(Date.now() + 20000),
				endsAt: new Date(Date.now() + 10000),
			};

			await expect(service.create(sellerId, invalidDates)).rejects.toThrow(
				AuctionsError,
			);

			await expect(service.create(sellerId, invalidDates)).rejects.toThrow(
				'Start date must be before end date',
			);
		});
	});

	describe('list', () => {
		it('should return a list of auctions', async () => {
			const mockAuctions = [{ id: 'auc-1' }, { id: 'auc-2' }];
			mockAuctionsRepository.findAll.mockResolvedValue(mockAuctions);

			const result = await service.list();

			expect(result).toEqual(mockAuctions);
			expect(mockAuctionsRepository.findAll).toHaveBeenCalled();
		});
	});
});
