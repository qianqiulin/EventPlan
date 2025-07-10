import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { dayjs, Event as CustomEvent, EventData } from '@jstiava/chronos';

function mapDbRowToEvent(row: any): EventData {
  const start = dayjs(row.start_time);
  const end = dayjs(row.end_time);

  const date = Number(start.format('YYYYMMDD'));
  const startTime = String(start.hour() + start.minute() / 60);
  const endTime = String(end.hour() + end.minute() / 60);

  return new CustomEvent({
        uuid:row.event_id,
        name: row.name,
        date:row.event_date,
        start_time: row.start_time,
        end_time: row.end_time,
        location: row.location,
        icon_img:row.image_url ? { path: row.image_url, alt: row.title } : null,
        metadata: {
          description: row.description
    }
  }).eject();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_id', id)
    .single(); // ensures exactly one row

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return res.status(404).json({ message: 'Event not found' });
  }

  const event = mapDbRowToEvent(data);
  return res.status(200).json(event);
  }

  if (req.method === 'DELETE') {
    /* DELETE function*/
  }


  if (req.method === 'PUT') {
    /*PUT function*/
  }

  res.setHeader('Allow', 'GET, PUT,DELETE');
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
