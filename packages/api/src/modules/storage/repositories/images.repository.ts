export interface ImageRecord {
	id: string;
	url: string;
	urlPublic: string;
	sizeBytes: number;
	ownerId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateImageDto {
	url: string;
	urlPublic: string;
	sizeBytes: number;
	ownerId: string;
}

/**
 * Contrato para gerenciar registros de imagens no banco de dados.
 */
export interface ImagesRepository {
	/**
	 * Busca uma imagem pelo ID e pelo ID do proprietário.
	 */
	findByIdAndOwner(id: string, ownerId: string): Promise<ImageRecord | null>;

	/**
	 * Cria um novo registro de imagem.
	 */
	create(data: CreateImageDto): Promise<ImageRecord>;

	/**
	 * Deleta um registro de imagem pelo ID.
	 */
	delete(id: string): Promise<void>;
}
