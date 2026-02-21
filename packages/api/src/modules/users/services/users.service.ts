import type { UserProfile } from '../types';

/**
 * Abstract Users Service
 * Permite trocar implementação (DB, API externa, etc) facilmente
 */
export abstract class UsersService {
	/**
	 * Obtém dados do usuário autenticado
	 */
	abstract getMe(userId: string): Promise<UserProfile | null>;

	/**
	 * Atualiza perfil do usuário
	 */
	abstract updateProfile(
		userId: string,
		data: Partial<UserProfile>,
	): Promise<UserProfile>;
}

