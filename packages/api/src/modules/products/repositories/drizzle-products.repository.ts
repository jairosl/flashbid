import { count, eq } from 'drizzle-orm';
import { injectable } from 'inversify';
import { db } from '@/lib/database/drizzle/client';
import { image, product } from '@/lib/database/drizzle/schema';
import type { CreateProductData, Product } from '../types';
import type { ProductsRepository } from './products.repository';

@injectable()
export class DrizzleProductsRepository implements ProductsRepository {
	async create(
		ownerId: string,
		data: Omit<CreateProductData, 'image'> & { imageId?: string },
	): Promise<Product> {
		const [newProduct] = await db
			.insert(product)
			.values({
				name: data.name,
				description: data.description,
				imageId: data.imageId,
				ownerId: ownerId,
			})
			.returning();

		// If it has an image, we fetch with join to return the URL
		if (newProduct.imageId) {
			const productWithImage = await this.findById(newProduct.id);
			if (productWithImage) return productWithImage;
		}

		return newProduct as Product;
	}

	async findAll(): Promise<Product[]> {
		const results = await db
			.select({
				id: product.id,
				name: product.name,
				description: product.description,
				imageId: product.imageId,
				ownerId: product.ownerId,
				createdAt: product.createdAt,
				updatedAt: product.updatedAt,
				imageUrl: image.urlPublic,
			})
			.from(product)
			.leftJoin(image, eq(product.imageId, image.id));

		return results as Product[];
	}

	async findById(id: string): Promise<Product | null> {
		const [result] = await db
			.select({
				id: product.id,
				name: product.name,
				description: product.description,
				imageId: product.imageId,
				ownerId: product.ownerId,
				createdAt: product.createdAt,
				updatedAt: product.updatedAt,
				imageUrl: image.urlPublic,
			})
			.from(product)
			.leftJoin(image, eq(product.imageId, image.id))
			.where(eq(product.id, id));

		return (result as Product) || null;
	}

	async countByOwnerId(ownerId: string): Promise<number> {
		const [result] = await db
			.select({ value: count() })
			.from(product)
			.where(eq(product.ownerId, ownerId));

		return result?.value ?? 0;
	}
}
