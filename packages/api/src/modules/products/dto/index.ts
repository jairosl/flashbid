import { t } from 'elysia';

/**
 * DTO for creating a product
 */
export const createProductDto = t.Object({
	name: t.String({ minLength: 3, maxLength: 100 }),
	description: t.Optional(t.String({ maxLength: 500 })),
	image: t.Optional(
		t.File({
			type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
			maxSize: 2 * 1024 * 1024, // 2MB
		}),
	),
});

/**
 * DTO for product response
 */
export const productResponseDto = t.Object({
	id: t.String({ format: 'uuid' }),
	name: t.String(),
	description: t.Optional(t.Nullable(t.String())),
	imageId: t.Optional(t.Nullable(t.String())),
	imageUrl: t.Optional(t.Nullable(t.String())),
	ownerId: t.String({ format: 'uuid' }),
	createdAt: t.Union([t.Date(), t.String()]),
	updatedAt: t.Union([t.Date(), t.String()]),
});
