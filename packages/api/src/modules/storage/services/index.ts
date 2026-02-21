import type { StorageService } from './storage.service';
import { SupabaseStorageService } from './supabase-storage.service';

export * from './storage.service';
export * from './supabase-storage.service';

/**
 * Factory para criar instância do StorageService
 * Permite trocar implementação facilmente via variável de ambiente
 */
export const createStorageService = (): StorageService => {
	return new SupabaseStorageService();
};
