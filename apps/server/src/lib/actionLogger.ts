// actionLogger.ts
import { supabase } from './supabase';

export async function logAction(userId: string, type: string, payload: any, status: string) {
  const { data, error } = await supabase.from('actions').insert([
    {
      user_id: userId,
      type,
      payload,
      status,
      created_at: new Date().toISOString(),
    },
  ]);
  if (error) {
    console.error('Supabase log error:', error);
  }
  return data;
}
