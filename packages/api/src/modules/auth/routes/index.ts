import { Elysia } from 'elysia';
import { authPlugin } from '@/lib/http/plugins';

/**
 * Rotas de autenticação
 * As rotas são montadas automaticamente pelo Better Auth via plugin.
 */
export const authRoutes = new Elysia().use(authPlugin);
