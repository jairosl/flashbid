import { AppError } from '@/modules/common/errors/app-error';

export class AuctionsError extends AppError {
	constructor(
		message: string,
		code = 'AUCTION_ERROR',
		status = 400,
		details?: Record<string, unknown>,
	) {
		super(message, code, status, details);
		this.name = 'AuctionsError';
	}
}
