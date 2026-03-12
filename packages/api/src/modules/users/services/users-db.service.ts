import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { db } from '@/lib/database/drizzle/client';
import { user } from '@/lib/database/drizzle/schema';
import { NotFoundError } from '@/modules/common/errors';
import { logger } from '@/lib/logger';
import type { UserProfile } from '../types';
import type { UsersService } from './users.service';

/**
 * Implementação do UsersService usando Drizzle ORM
 */
@injectable()
export class UsersDbService implements UsersService {
	async getMe(userId: string): Promise<UserProfile | null> {
		const [userData] = await db.select().from(user).where(eq(user.id, userId));

		if (!userData) {
			throw new NotFoundError('User not found');
		}

		return userData as UserProfile;
	}

	async updateProfile(
		userId: string,
		data: Partial<UserProfile>,
	): Promise<UserProfile> {
		logger.debug('Updating user profile', { userId });

		const [updated] = await db
			.update(user)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(user.id, userId))
			.returning();

		if (!updated) {
			logger.warn('User not found for profile update', { userId });
			throw new NotFoundError('User not found');
		}

		logger.info('User profile updated successfully', { userId });

		return updated as UserProfile;
	}
}
