import type { CreateProductData, Product } from '../types';

/**
 * Abstract Products Service
 * Permite trocar implementação (DB, API externa, etc) facilmente
 */
export abstract class ProductsService {
	/**
	 * Cria um novo produto
	 */
	abstract create(
		sellerId: string,
		data: CreateProductData,
	): Promise<Product>;

	/**
	 * Lista produtos
	 */
	abstract list(): Promise<Product[]>;

	/**
	 * Obtém produto por ID
	 */
	abstract getById(id: string): Promise<Product | null>;
}
