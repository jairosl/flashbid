import { t } from 'elysia';
import { AuctionStatus } from '../types';

/**
 * DTO para criar um leilão
 */
export const createAuctionDto = t.Object({
	productId: t.String({ format: 'uuid' }),
	startPrice: t.Number({ minimum: 0.01 }),
	minStep: t.Optional(t.Number({ minimum: 0.01, default: 1.0 })),
	buyNowPrice: t.Optional(t.Number({ minimum: 0.01 })),
	startsAt: t.Transform(t.Union([t.Date(), t.String()]))
		.Decode((value) => (value instanceof Date ? value : new Date(value)))
		.Encode((value) => value.toISOString()),
	endsAt: t.Transform(t.Union([t.Date(), t.String()]))
		.Decode((value) => (value instanceof Date ? value : new Date(value)))
		.Encode((value) => value.toISOString()),
});

/**
 * DTO para resposta de leilão
 */
export const auctionResponseDto = t.Object({
	id: t.String({ format: 'uuid' }),
	productId: t.String({ format: 'uuid' }),
	sellerId: t.String({ format: 'uuid' }),
	startPrice: t.String(),
	minStep: t.Nullable(t.String()),
	buyNowPrice: t.Nullable(t.String()),
	status: t.Enum(AuctionStatus),
	startsAt: t.Union([t.Date(), t.String()]),
	endsAt: t.Union([t.Date(), t.String()]),
	createdAt: t.Union([t.Date(), t.String()]),
	updatedAt: t.Union([t.Date(), t.String()]),
});
