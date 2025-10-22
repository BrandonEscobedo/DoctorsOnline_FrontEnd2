// src/supabase-client.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// La palabra "export" aquí es la clave.
// Sin ella, la variable 'supabase' existe pero no es visible para otros archivos.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);