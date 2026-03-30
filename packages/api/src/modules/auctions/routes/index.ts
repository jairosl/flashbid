import { Elysia, t } from 'elysia';
import { container } from '@/lib/di/container';
import { TYPES } from '@/lib/di/types';
import { authPlugin } from '@/lib/http/plugins';
import type { AuctionsController, BidsController } from '../controllers';
import { auctionResponseDto, createAuctionDto, createBidDto } from '../dto';

const controller = container.get<AuctionsController>(TYPES.AuctionsController);
const bidsController = container.get<BidsController>(TYPES.BidsController);

export const auctionsRoutes = new Elysia({
	prefix: 'auctions',
})
	.use(authPlugin)
	.get('/', controller.list, {
		response: t.Object({
			success: t.Boolean(),
			data: t.Optional(t.Array(auctionResponseDto)),
			error: t.Optional(
				t.Object({
					code: t.String(),
					message: t.String(),
					details: t.Optional(t.Any()),
				}),
			),
		}),
		detail: {
			tags: ['Auctions'],
			summary: 'List all auctions',
			description: 'Retrieves a list of all auctions in the system',
		},
	})
	.post('/', controller.create, {
		auth: true,
		body: createAuctionDto,
		response: t.Object({
			success: t.Boolean(),
			data: t.Optional(auctionResponseDto),
			error: t.Optional(
				t.Object({
					code: t.String(),
					message: t.String(),
					details: t.Optional(t.Any()),
				}),
			),
		}),
		detail: {
			tags: ['Auctions'],
			summary: 'Create a new auction',
			description: 'Creates a new auction for a product owned by the user',
		},
	})
	.post('/:id/bids', bidsController.placeBid, {
		auth: true,
		params: t.Object({ id: t.String({ format: 'uuid' }) }),
		body: createBidDto,
		response: t.Object({
			success: t.Boolean(),
			data: t.Optional(t.Any()),
			error: t.Optional(
				t.Object({
					code: t.String(),
					message: t.String(),
					details: t.Optional(t.Any()),
				}),
			),
		}),
		detail: {
			tags: ['Auctions'],
			summary: 'Place a bid',
			description: 'Places a bid on an active auction',
		},
	});

