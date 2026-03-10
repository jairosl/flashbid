import { Elysia, t } from 'elysia';
import { container } from '@/lib/di/container';
import { TYPES } from '@/lib/di/types';
import { authPlugin } from '@/lib/http/plugins';
import type { ProductsController } from '../controllers';
import { createProductDto, productResponseDto } from '../dto';

const controller = container.get<ProductsController>(TYPES.ProductsController);

export const productsRoutes = new Elysia({
	prefix: 'products',
})
	.use(authPlugin)
	.get('/', controller.list, {
		response: t.Object({
			success: t.Boolean(),
			data: t.Array(productResponseDto),
		}),
		detail: {
			tags: ['Products'],
			summary: 'List all products',
			description: 'Retrieves a list of all products in the system',
		},
	})
	.get('/:id', controller.getById, {
		params: t.Object({
			id: t.String(),
		}),
		response: t.Object({
			success: t.Boolean(),
			data: t.Nullable(productResponseDto),
		}),
		detail: {
			tags: ['Products'],
			summary: 'Get product by ID',
			description: 'Retrieves a single product by its unique identifier',
		},
	})
	.post('/', controller.create, {
		auth: true,
		body: createProductDto,
		response: t.Object({
			success: t.Boolean(),
			data: productResponseDto,
		}),
		detail: {
			tags: ['Products'],
			summary: 'Create a new product',
			description: 'Creates a new product for the authenticated user',
		},
	});
