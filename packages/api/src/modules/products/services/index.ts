import { ProductsDbService } from './products-db.service';
import type { ProductsService } from './products.service';

export * from './products.service';
export * from './products-db.service';

/**
 * Factory para criar instância do ProductsService
 */
export const createProductsService = (): ProductsService => {
	return new ProductsDbService();
};

