import type { CreateProductData, Product } from '../types';
import { ProductsService } from './products.service';

/**
 * Implementação do ProductsService usando Drizzle ORM
 * TODO: Implementar quando schema de produtos estiver pronto
 */
export class ProductsDbService extends ProductsService {
	async create(
		sellerId: string,
		data: CreateProductData,
	): Promise<Product> {
		// TODO: Implementar com Drizzle
		throw new Error('Not implemented yet');
	}

	async list(): Promise<Product[]> {
		// TODO: Implementar com Drizzle
		return [];
	}

	async getById(id: string): Promise<Product | null> {
		// TODO: Implementar com Drizzle
		return null;
	}
}
