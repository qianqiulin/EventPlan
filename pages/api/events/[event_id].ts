import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { dayjs, Event as CustomEvent, EventData } from '@jstiava/chronos';

/* ─────────────── helper: DB row → chronos EventData ─────────────── */
function mapDbRowToEvent(row: any): EventData {
  const start = dayjs(row.start_time);
  const end   = dayjs(row.end_time);

  return new CustomEvent({
    event_id  : row.event_id,
    name      : row.name,
    date      : row.event_date,
    start_time: row.start_time,
    end_time  : row.end_time,
    location  : row.location,
    icon_img  : row.image_url ? { path: row.image_url, alt: row.name } : null,
    metadata  : { description: row.description ?? undefined },
  }).eject();
}

/* ─────────────── route handler ─────────────── */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // [[...event_id]] → id may be undefined or an array
  const { event_id } = req.query;
  const id = Array.isArray(event_id) ? event_id[0] : event_id;   // string | undefined

  try {
    /* ─────── GET ─────── */
    if (req.method === 'GET') {
      if (id) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('event_id', id)
          .single();

        if (error || !data) return res.status(404).json({ message: 'Event not found' });
        return res.status(200).json(mapDbRowToEvent(data));
      }

      // list all events
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date');

      if (error) throw error;
      return res.status(200).json(data.map(mapDbRowToEvent));
    }

    /* ─────── POST (create) ─────── */
    if (req.method === 'POST') {
      if (id)
        return res.status(400).json({ message: 'POST to /api/events (no ID) to create new events' });

      const { name, event_date, location, image_url, start_time, end_time, description } = req.body;

      const { error } = await supabase.from('events').insert({
        name,
        event_date,
        location,
        image_url,
        start_time,
        end_time,
        description,
      });

      if (error) throw error;
      return res.status(201).json({ message: 'Event created' });
    }

    /* ─────── PUT (update) ─────── */
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ message: 'Missing event_id in URL' });

      const { name, event_date, location, image_url, start_time, end_time, description } = req.body;

      const { error, data } = await supabase
        .from('events')
        .update({
          name,
          event_date,
          location,
          image_url,
          start_time,
          end_time,
          description,
        })
        .eq('event_id', id)
        .select()
        .single();

      if (error) return res.status(404).json({ message: 'Event not found' });
      return res.status(200).json(mapDbRowToEvent(data));
    }

    /* ─────── DELETE ─────── */
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ message: 'Missing event_id in URL' });

      const { error } = await supabase.from('events').delete().eq('event_id', id);
      if (error) return res.status(404).json({ message: 'Event not found' });

      return res.status(200).json({ message: 'Event deleted' });
    }

    /* ─────── unsupported verb ─────── */
    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).end(`Method ${req.method} not allowed`);
  } catch (err) {
    console.error('❌ API error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
