import type { CreateProductData, Product } from '../types';

export interface ProductsRepository {
	create(
		ownerId: string,
		data: Omit<CreateProductData, 'image'> & { imageId?: string },
	): Promise<Product>;
	findAll(): Promise<Product[]>;
	findById(id: string): Promise<Product | null>;
	countByOwnerId(ownerId: string): Promise<number>;
}
