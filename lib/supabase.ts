// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dvxsigvatucbdlqrguud.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY!;  // use secure server-side key

export const supabase = createClient(supabaseUrl, supabaseKey);
