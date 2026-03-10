import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import type { AuthenticatedRequest } from '@/modules/common/types';
import type { UsersService } from '../services/users.service';

/**
 * Controller de usuários
 */
@injectable()
export class UsersController {
	constructor(@inject(TYPES.UsersService) private usersService: UsersService) {}

	/**
	 * Retorna o usuário autenticado
	 */
	getMe = async ({ user }: AuthenticatedRequest) => {
		const userData = await this.usersService.getMe(user.id);

		return {
			success: true,
			data: userData,
		};
	};
}
