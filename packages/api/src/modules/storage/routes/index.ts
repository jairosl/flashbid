import { Elysia, t } from 'elysia';
import { authPlugin } from '@/lib/http/plugins';
import { StorageController } from '../controllers';
import {
	deleteFileDto,
	uploadFileDto,
	uploadFileResponseDto,
} from '../dto';

const controller = new StorageController();

export const storageRoutes = new Elysia({
	prefix: '/storage',
})
	.use(authPlugin)
	.guard({ auth: true })

	// Upload de arquivo
	.post('/upload', controller.uploadFile, {
		body: uploadFileDto,
		headers: t.Object({
			'content-type': t.String({
				pattern: '^multipart\\/form-data(?:;.*)?$',
			}),
		}),
		response: {
			200: uploadFileResponseDto,
		},
		detail: {
			tags: ['Storage'],
			summary: 'Upload de arquivo',
			description:
				'Faz upload de uma imagem para o Supabase Storage',
		},
	})

	// Deletar arquivo
	.delete('/:path', controller.deleteFile, {
		params: deleteFileDto,
		detail: {
			tags: ['Storage'],
			summary: 'Deletar arquivo',
			description: 'Remove um arquivo do storage',
		},
	});
