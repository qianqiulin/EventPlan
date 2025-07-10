import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { dayjs, Event as CustomEvent,EventData } from '@jstiava/chronos';

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
  if (req.method === 'POST') {
    /* need POST method*/
  } 
  
  else if (req.method === 'GET'){
    const { data, error } = await supabase.from('events').select('*');

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      return res.status(500).json({ message: 'Supabase fetch error' });
    }

    const events = data.map(mapDbRowToEvent);
    return res.status(200).json(events);
  }
  else {
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end('Method Not Allowed');
  }
}
