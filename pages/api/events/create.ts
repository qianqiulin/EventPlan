// pages/api/events/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';     // make sure this points to your server-key client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { name, event_date, location, image_url, start_time, end_time, description } = req.body;

  try {
    const { error } = await supabase.from('events').insert({
      name,
      event_date,
      location,
      image_url,
      description,  
      start_time,
      end_time 
    });

    if (error) throw error;

    return res.status(201).json({ message: 'Event created' });
  } catch (err) {
    console.error('❌ Supabase insert error:', err);
    return res.status(500).json({ message: 'Error creating event' });
  }
}
