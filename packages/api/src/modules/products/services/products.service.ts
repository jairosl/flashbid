import type { CreateProductData, Product } from '../types';

/**
 * Products Service Interface
 */
export interface ProductsService {
	/**
	 * Creates a new product
	 */
	create(ownerId: string, data: CreateProductData): Promise<Product>;

	/**
	 * Lists products
	 */
	list(): Promise<Product[]>;

	/**
	 * Gets product by ID
	 */
	getById(id: string): Promise<Product | null>;
}
