import { account } from './accounts';
import { auction } from './auctions';
import { image } from './images';
import { product } from './products';
import { session } from './sessions';
import { user } from './users';
import { verification } from './verifications';

export const schema = {
	user,
	session,
	account,
	verification,
	image,
	product,
	auction,
};

export { user, session, account, verification, image, product, auction };
