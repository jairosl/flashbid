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
		const { file, folder } = body;

		const result = await this.storageService.uploadFile(
			file,
			{
				folder: folder || 'products',
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
	}: {
		params: DeleteFileDto;
	}) => {
		await this.storageService.deleteFile(params.path);

		return {
			success: true,
			message: 'File deleted successfully',
		};
	};
}
