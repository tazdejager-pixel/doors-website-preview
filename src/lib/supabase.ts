import { createClient } from '@supabase/supabase-js';

// DOORS-owned Supabase project (Chris's account). Migrated off the temporary
// Famous "databasepad" backend on 07/07/2026.
const supabaseUrl = 'https://stgpdnxengnhsliqwavh.supabase.co';
const supabaseKey = 'sb_publishable_54HNuuXIbonI-x0YUToYWw_9gwuI6pK';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
