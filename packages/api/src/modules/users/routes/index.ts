import { Elysia } from 'elysia';
import { authPlugin } from '@/lib/http/plugins';
import { UsersController } from '../controllers';

const controller = new UsersController();

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

