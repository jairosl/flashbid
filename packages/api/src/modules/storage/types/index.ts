/**
 * Resultado do upload de arquivo
 */
export interface UploadResult {
	url: string;
	path: string;
	fullPath: string;
	imageId?: string;
}

/**
 * Resposta do upload com referência no banco
 */
export interface UploadResponse {
	data: UploadResult;
}

/**
 * Opções de upload
 */
export interface UploadOptions {
	/**
	 * Pasta dentro do bucket (ex: 'products', 'avatars')
	 */
	folder?: string;

	/**
	 * Se true, sobrescreve arquivo existente
	 */
	upsert?: boolean;

	/**
	 * Content type do arquivo
	 */
	contentType?: string;

	/**
	 * Dono do arquivo para persistência no banco
	 */
	ownerId?: string;
}

/**
 * Opções de validação de arquivo
 */
export interface FileValidationOptions {
	maxSizeInMB?: number;
	allowedTypes?: string[];
}
