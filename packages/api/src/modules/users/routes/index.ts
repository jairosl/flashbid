import { Elysia } from 'elysia';
import { container } from '@/lib/di/container';
import { TYPES } from '@/lib/di/types';
import { authPlugin } from '@/lib/http/plugins';
import type { UsersController } from '../controllers';

const controller = container.get<UsersController>(TYPES.UsersController);

export const usersRoutes = new Elysia({
	prefix: 'users',
})
	.use(authPlugin)
	.get('/', controller.getMe, {
		auth: true,
		detail: {
			tags: ['Users'],
			summary: 'Obter perfil do usuário autenticado',
			description: 'Retorna os dados do usuário logado',
		},
	});
