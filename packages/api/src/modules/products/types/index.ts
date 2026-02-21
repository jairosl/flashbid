/**
 * Tipos do módulo de produtos
 */
export interface Product {
	id: string;
	name: string;
	description?: string;
	startingPrice: number;
	currentPrice?: number;
	imageId?: string;
	sellerId: string;
	status: 'draft' | 'active' | 'sold' | 'cancelled';
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateProductData {
	name: string;
	description?: string;
	startingPrice: number;
	imageId?: string;
}
