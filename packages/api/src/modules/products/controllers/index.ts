import { createProductsService } from '../services';
import type { ProductsService } from '../services';

/**
 * Controller de produtos
 */
export class ProductsController {
	private productsService: ProductsService;

	constructor() {
		this.productsService = createProductsService();
	}

	/**
	 * Cria um novo produto
	 */
	create = async ({ user, body }: { user: any; body: any }) => {
		const product = await this.productsService.create(user.id, body);

		return {
			success: true,
			data: product,
		};
	};
}

