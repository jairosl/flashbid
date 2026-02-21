/**
 * Tipos do módulo de usuários
 */
export interface UserProfile {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
}

