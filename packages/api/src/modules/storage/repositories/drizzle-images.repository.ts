import { and, eq } from 'drizzle-orm';
import { injectable } from 'inversify';
import { db } from '@/lib/database/drizzle/client';
import { image } from '@/lib/database/drizzle/schema';
import type {
	CreateImageDto,
	ImageRecord,
	ImagesRepository,
} from './images.repository';

/**
 * Implementação do ImagesRepository usando Drizzle ORM.
 */
@injectable()
export class DrizzleImagesRepository implements ImagesRepository {
	async findByIdAndOwner(
		id: string,
		ownerId: string,
	): Promise<ImageRecord | null> {
		const [imageRecord] = await db
			.select()
			.from(image)
			.where(and(eq(image.id, id), eq(image.ownerId, ownerId)));

		return imageRecord || null;
	}

	async create(data: CreateImageDto): Promise<ImageRecord> {
		const [imageRecord] = await db
			.insert(image)
			.values({
				url: data.url,
				urlPublic: data.urlPublic,
				sizeBytes: data.sizeBytes,
				ownerId: data.ownerId,
			})
			.returning();

		return imageRecord;
	}

	async delete(id: string): Promise<void> {
		await db.delete(image).where(eq(image.id, id));
	}
}
