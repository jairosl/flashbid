/**
 * Tipos do módulo de produtos
 */
export interface Product {
	id: string;
	name: string;
	description?: string | null;
	imageId?: string | null;
	imageUrl?: string | null;
	ownerId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateProductData {
	name: string;
	description?: string;
	image?: File | Blob;
}
