import type { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/lib/db';
import { dayjs, Event as CustomEvent,EventData } from '@jstiava/chronos';

function mapDbRowToEvent(row: any): EventData {
    const start = dayjs(row.start_time);
    const end = dayjs(row.end_time);
  
    const date = Number(start.format('YYYYMMDD'));
    const startTime = String(start.hour() + start.minute() / 60);
    const endTime = String(end.hour() + end.minute() / 60);
  
    return new CustomEvent({
        uuid:row.id,
        name: row.title,
        date,
        start_time: startTime,
        end_time: endTime,
        location: row.location,
        icon_img:row.image_url ? { path: row.image_url, alt: row.title } : null,
        metadata: {
          description: row.description
        }
    }).eject();
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
        name,
        location,
        start_time,
        end_time,
        description,
        price = 0,
        image_url = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%2Fimages%3Fk%3Dnull&psig=AOvVaw3f9xoM_StfyycCbEH4LPLs&ust=1751122179503000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiRnc3skY4DFQAAAAAdAAAAABAE',
      } = req.body;

    if (!name || !location || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const db = await openDb();
    try {
        const result = await db.run(
            `INSERT INTO events_event 
              (title, description, image_url, price, location, start_time, end_time)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            name, description, image_url, price, location, start_time, end_time
          );

      res.status(201).json({ id: result.lastID });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Database error' });
    }
  } 
  
  else if (req.method === 'GET'){
    const db = await openDb();
  const rows = await db.all('SELECT * FROM events_event'); 
  const events = rows.map(mapDbRowToEvent);
  res.status(200).json(events);
  }
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
