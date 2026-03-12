import 'reflect-metadata';
import { Container } from 'inversify';
// Auctions Module
import { AuctionsController } from '@/modules/auctions/controllers';
import { DrizzleAuctionsRepository } from '@/modules/auctions/repositories/drizzle-auctions.repository';
import type { AuctionsRepository } from '@/modules/auctions/repositories/auctions.repository';
import { AuctionsDbService } from '@/modules/auctions/services/auctions-db.service';
import type { AuctionsService } from '@/modules/auctions/services/auctions.service';

// Auth Module
import { BetterAuthService } from '@/modules/auth/services/better-auth.service';
import type { AuthService } from '@/modules/auth/services/auth.service';

// Products Module
import { ProductsController } from '@/modules/products/controllers';
import { DrizzleProductsRepository } from '@/modules/products/repositories/drizzle-products.repository';
import type { ProductsRepository } from '@/modules/products/repositories/products.repository';
import { ProductsDbService } from '@/modules/products/services/products-db.service';
import type { ProductsService } from '@/modules/products/services/products.service';

// Storage Module
import { supabase } from '@/modules/storage/client';
import { DrizzleImagesRepository } from '@/modules/storage/repositories/drizzle-images.repository';
import type { ImagesRepository } from '@/modules/storage/repositories/images.repository';
import { SupabaseStorageService } from '@/modules/storage/services/supabase-storage.service';
import type { StorageService } from '@/modules/storage/services/storage.service';

// Users Module
import { UsersDbService } from '@/modules/users/services/users-db.service';
import type { UsersService } from '@/modules/users/services/users.service';
import { UsersController } from '@/modules/users/controllers';
import { TYPES } from './types';

const container = new Container();

// Infrastructure Bindings
container.bind(TYPES.SupabaseClient).toConstantValue(supabase);

// Users Bindings
container
	.bind<UsersService>(TYPES.UsersService)
	.to(UsersDbService)
	.inSingletonScope();
container
	.bind<UsersController>(TYPES.UsersController)
	.to(UsersController)
	.inSingletonScope();

// Auctions Bindings
container
	.bind<AuctionsService>(TYPES.AuctionsService)
	.to(AuctionsDbService)
	.inSingletonScope();
container
	.bind<AuctionsController>(TYPES.AuctionsController)
	.to(AuctionsController)
	.inSingletonScope();
container
	.bind<AuctionsRepository>(TYPES.AuctionsRepository)
	.to(DrizzleAuctionsRepository)
	.inSingletonScope();

// Products Bindings
container
	.bind<ProductsService>(TYPES.ProductsService)
	.to(ProductsDbService)
	.inSingletonScope();
container
	.bind<ProductsController>(TYPES.ProductsController)
	.to(ProductsController)
	.inSingletonScope();
container
	.bind<ProductsRepository>(TYPES.ProductsRepository)
	.to(DrizzleProductsRepository)
	.inSingletonScope();

// Storage Bindings
container
	.bind<ImagesRepository>(TYPES.ImagesRepository)
	.to(DrizzleImagesRepository)
	.inSingletonScope();
container
	.bind<StorageService>(TYPES.StorageService)
	.to(SupabaseStorageService)
	.inSingletonScope();

// Auth Bindings
container
	.bind<AuthService>(TYPES.AuthService)
	.to(BetterAuthService)
	.inSingletonScope();

export { container };
