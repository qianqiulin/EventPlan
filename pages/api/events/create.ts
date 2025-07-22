// pages/api/events/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const toDbDate = (val: any) => {
  if (!val) return null;
  // from "2025-07-29" -> 20250729
  if (typeof val === 'string') return Number(val.replace(/-/g, ''));
  return Number(val);
};

const nullIfEmpty = (v: any) => (v === '' || v === undefined ? null : v);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const {
      name,
      event_date,
      location,
      image_url,
      start_time,
      end_time,
      description,
    } = req.body;

    const payload = {
      name,
      event_date: toDbDate(event_date),
      location,
      image_url,
      description,
      start_time: nullIfEmpty(start_time),
      end_time: nullIfEmpty(end_time),
    };

    const { error } = await supabase.from('events').insert(payload);
    if (error) throw error;

    return res.status(201).json({ message: 'Event created' });
  } catch (err) {
    console.error('❌ Supabase insert error:', err);
    return res.status(500).json({ message: 'Error creating event' });
  }
}

