import { UsersDbService } from './users-db.service';
import type { UsersService } from './users.service';

export * from './users.service';
export * from './users-db.service';

/**
 * Factory para criar instância do UsersService
 */
export const createUsersService = (): UsersService => {
	return new UsersDbService();
};

