import { t } from 'elysia';

/**
 * DTO para criar produto
 */
export const createProductDto = t.Object({
	name: t.String({ minLength: 3, maxLength: 100 }),
	description: t.Optional(t.String({ maxLength: 500 })),
	startingPrice: t.Number({ minimum: 0 }),
	imageId: t.Optional(t.String({ format: 'uuid' })),
});
