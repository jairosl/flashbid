import 'reflect-metadata';
import { Container } from 'inversify';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { TYPES } from '@/lib/di/types';
import type { AuthenticatedRequest } from '@/modules/common/types';
import type { AuctionsService } from '../services/auctions.service';
import { AuctionsController } from './index';

describe('AuctionsController', () => {
	let controller: AuctionsController;
	let mockService: Record<keyof AuctionsService, Mock>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockService = {
			create: vi.fn(),
			list: vi.fn(),
		};

		const container = new Container();
		container
			.bind<AuctionsService>(TYPES.AuctionsService)
			.toConstantValue(mockService as unknown as AuctionsService);
		container.bind(AuctionsController).to(AuctionsController);

		controller = container.get(AuctionsController);
	});

	describe('create', () => {
		it('should call service.create and return ApiResponse', async () => {
			const mockAuction = { id: 'auc-1' };
			mockService.create.mockResolvedValue(mockAuction);

			const request = {
				user: { id: 'user-1' },
				body: { productId: 'prod-1' },
			} as AuthenticatedRequest<any>;

			const result = await controller.create(request);

			expect(result).toEqual({
				success: true,
				data: mockAuction,
			});
			expect(mockService.create).toHaveBeenCalledWith('user-1', { productId: 'prod-1' });
		});
	});

	describe('list', () => {
		it('should call service.list and return ApiResponse', async () => {
			const mockAuctions = [{ id: 'auc-1' }];
			mockService.list.mockResolvedValue(mockAuctions);

			const result = await controller.list();

			expect(result).toEqual({
				success: true,
				data: mockAuctions,
			});
			expect(mockService.list).toHaveBeenCalled();
		});
	});
});
