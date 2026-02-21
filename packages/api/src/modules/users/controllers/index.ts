import { createUsersService } from '../services';
import type { UsersService } from '../services';

/**
 * Controller de usuários
 */
export class UsersController {
	private usersService: UsersService;

	constructor() {
		this.usersService = createUsersService();
	}

	/**
	 * Retorna o usuário autenticado
	 */
	getMe = async ({ user }: { user: any }) => {
		const userData = await this.usersService.getMe(user.id);

		return {
			success: true,
			data: userData,
		};
	};
}

