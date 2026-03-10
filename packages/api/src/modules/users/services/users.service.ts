import type { UserProfile } from '../types';

/**
 * Users Service Interface
 */
export interface UsersService {
	/**
	 * Obtém dados do usuário autenticado
	 */
	getMe(userId: string): Promise<UserProfile | null>;

	/**
	 * Atualiza perfil do usuário
	 */
	updateProfile(
		userId: string,
		data: Partial<UserProfile>,
	): Promise<UserProfile>;
}
