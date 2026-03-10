/** biome-ignore-all lint/style/noNonNullAssertion: TODO: adicionar validação das envs */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL_PROJECT!;
const supabaseKey = process.env.SUPABASE_API_KEY_SECRET!;

/**
 * Cliente Supabase configurado
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Nome do bucket padrão
 */
export const STORAGE_BUCKET = process.env.SUPABASE_BUCKET || 'flashbid';
