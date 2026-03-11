import 'reflect-metadata';
import { Container } from 'inversify';
// Auctions Module
import { AuctionsController } from '@/modules/auctions/controllers';
import type { AuctionsRepository } from '@/modules/auctions/repositories/auctions.repository';
import { DrizzleAuctionsRepository } from '@/modules/auctions/repositories/drizzle-auctions.repository';
import type { AuctionsService } from '@/modules/auctions/services/auctions.service';
import { AuctionsDbService } from '@/modules/auctions/services/auctions-db.service';
import type { AuthService } from '@/modules/auth/services/auth.service';

// Auth Module
import { BetterAuthService } from '@/modules/auth/services/better-auth.service';
import { ProductsController } from '@/modules/products/controllers';
import { DrizzleProductsRepository } from '@/modules/products/repositories/drizzle-products.repository';
import type { ProductsRepository } from '@/modules/products/repositories/products.repository';
import type { ProductsService } from '@/modules/products/services/products.service';
// Products Module
import { ProductsDbService } from '@/modules/products/services/products-db.service';

// Infrastructure
import { supabase } from '@/modules/storage/client';
import { DrizzleImagesRepository } from '@/modules/storage/repositories/drizzle-images.repository';
import type { ImagesRepository } from '@/modules/storage/repositories/images.repository';
import type { StorageService } from '@/modules/storage/services/storage.service';

// Storage Module
import { SupabaseStorageService } from '@/modules/storage/services/supabase-storage.service';
import { UsersController } from '@/modules/users/controllers';
import type { UsersService } from '@/modules/users/services/users.service';

// Users Module
import { UsersDbService } from '@/modules/users/services/users-db.service';
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
