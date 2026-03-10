import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import type {
	ApiResponse,
	AuthenticatedRequest,
	BaseRequest,
} from '@/modules/common/types';
import type { ProductsService } from '../services/products.service';
import type { CreateProductData, Product } from '../types';

/**
 * Products Controller
 */
@injectable()
export class ProductsController {
	constructor(
		@inject(TYPES.ProductsService) private productsService: ProductsService,
	) {}

	/**
	 * Creates a new product
	 */
	create = async ({
		user,
		body,
	}: AuthenticatedRequest<CreateProductData>): Promise<
		ApiResponse<Product>
	> => {
		const product = await this.productsService.create(user.id, body);

		return {
			success: true,
			data: product,
		};
	};

	/**
	 * Lists products
	 */
	list = async (): Promise<ApiResponse<Product[]>> => {
		const data = await this.productsService.list();
		return { success: true, data };
	};

	/**
	 * Gets product by ID
	 */
	getById = async ({
		params,
	}: BaseRequest<unknown, { id: string }>): Promise<
		ApiResponse<Product | null>
	> => {
		const data = await this.productsService.getById(params.id);
		return { success: true, data };
	};
}
