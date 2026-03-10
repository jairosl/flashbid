import type { auth } from '../client/better-auth.client';

export interface AuthService {
	readonly client: typeof auth;
}
