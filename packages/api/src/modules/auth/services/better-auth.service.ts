import { injectable } from 'inversify';
import { auth } from '../client/better-auth.client';
import type { AuthService } from './auth.service';

@injectable()
export class BetterAuthService implements AuthService {
	get client() {
		return auth;
	}
}
