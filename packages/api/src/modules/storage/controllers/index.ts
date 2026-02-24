import type {
	DeleteFileDto,
	UploadFileDto,
	UploadFileResponseDto,
} from '../dto';
import type { StorageService } from '../services';
import { createStorageService } from '../services';

/**
 * Controller para operações de storage
 */
export class StorageController {
	constructor(
		private storageService: StorageService = createStorageService(),
	) {}

	/**
	 * Upload de arquivo único
	 */
	uploadFile = async ({
		body,
		user,
	}: {
		body: UploadFileDto;
		user: { id: string };
	}): Promise<UploadFileResponseDto> => {
		const { file } = body;

		const result = await this.storageService.uploadFile(
			file,
			{
				folder: 'products',
				ownerId: user.id,
			},
		);

		return result;
	};

	/**
	 * Deletar arquivo
	 */
	deleteFile = async ({
		params,
		user,
	}: {
		params: DeleteFileDto;
		user: { id: string };
	}) => {
		await this.storageService.deleteFile(
			params.imageId,
			user.id,
		);

		return {
			success: true,
			message: 'File deleted successfully',
		};
	};
}
