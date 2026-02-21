import { t } from 'elysia';

/**
 * DTO para obter perfil do usuário
 */
export const getMeDto = t.Object({});

/**
 * DTO para atualizar perfil (futuro)
 */
export const updateProfileDto = t.Object({
	name: t.Optional(t.String({ minLength: 2 })),
	image: t.Optional(t.String()),
});

