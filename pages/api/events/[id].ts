import { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/lib/db';
import { dayjs, Event as CustomEvent, EventData } from '@jstiava/chronos';

function mapDbRowToEvent(row: any): EventData {
  const start = dayjs(row.start_time);
  const end = dayjs(row.end_time);

  const date = Number(start.format('YYYYMMDD'));
  const startTime = String(start.hour() + start.minute() / 60);
  const endTime = String(end.hour() + end.minute() / 60);

  return new CustomEvent({
    uuid: row.id,
    name: row.title,
    date,
    start_time: startTime,
    end_time: endTime,
    icon_img: row.image_url ? { path: row.image_url, alt: row.title } : null,
    location: row.location,
    metadata: {
      description: row.description,
    },
  }).eject();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = await openDb();

  if (req.method === 'GET') {
    const row = await db.get('SELECT * FROM events_event WHERE id = ?', id);

    if (!row) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = mapDbRowToEvent(row);
    return res.status(200).json(event);
  }

  if (req.method === 'DELETE') {
    await db.run('DELETE FROM events_event WHERE id = ?', id);
    return res.status(204).end();
  }


  if (req.method === 'PUT') {
    const { name, location, start_time, end_time, description } = req.body;
    const title = name;


    if (!title || !location || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const result = await db.run(
        `UPDATE events_event 
         SET title = ?, location = ?, start_time = ?, end_time = ?, description = ?
         WHERE id = ?`,
        title, location, start_time, end_time, description || '', id
      );

      if (result.changes === 0) {
        return res.status(404).json({ message: 'Event not found or unchanged' });
      }

      return res.status(200).json({ message: 'Event updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database update error' });
    }
  }

  res.setHeader('Allow', 'GET, PUT,DELETE');
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
