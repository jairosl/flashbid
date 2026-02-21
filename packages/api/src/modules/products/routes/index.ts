import { Elysia } from 'elysia';
import { authPlugin } from '@/lib/http/plugins';
import { ProductsController } from '../controllers';
import { createProductDto } from '../dto';

const controller = new ProductsController();

export const productsRoutes = new Elysia({
	prefix: '/products',
})
	.use(authPlugin)
	.guard({ auth: true })
	.post('/', controller.create, {
		body: createProductDto,
		detail: {
			tags: ['Products'],
			summary: 'Criar produto',
			description: 'Cria um novo produto para leilão',
		},
	});

