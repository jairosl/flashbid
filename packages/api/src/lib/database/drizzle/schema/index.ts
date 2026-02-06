import { account } from './accounts';
import { auction } from './auctions';
import { product } from './products';
import { session } from './sessions';
import { user } from './users';
import { verification } from './verifications';

export const schema = {
	user,
	session,
	account,
	verification,
	product,
	auction,
};
