import { type Static, t } from 'elysia';

/**
 * DTO para upload de arquivo
 */
export const uploadFileDto = t.Object({
	file: t.File({
		type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
		maxSize: 2 * 1024 * 1024, // 2MB
	}),
});

export type UploadFileDto = Static<typeof uploadFileDto>;

/**
 * DTO de resposta do upload
 */
export const uploadFileResponseDto = t.Object({
	url: t.String(),
	path: t.String(),
	fullPath: t.String(),
	imageId: t.Optional(t.String({ format: 'uuid' })),
});

export type UploadFileResponseDto = Static<typeof uploadFileResponseDto>;

/**
 * DTO para deletar arquivo
 */
export const deleteFileDto = t.Object({
	imageId: t.String({ format: 'uuid' }),
});

export type DeleteFileDto = Static<typeof deleteFileDto>;
