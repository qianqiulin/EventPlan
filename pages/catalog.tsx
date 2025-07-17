import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';
import { dayjs, EventData } from "@jstiava/chronos";
import advancedFormat from 'dayjs/plugin/advancedFormat';   // “Do” ⇒ 17th, 1st …
dayjs.extend(advancedFormat);

const Catalog: NextPage = () => {
  const [tableName, setTableName] = useState('events');
  const [events, setEvents] = useState<EventData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEvents(null);

    fetch(`/api/events?table=${tableName}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        const parsed: UIEvent[] = data.map((e: EventData) => {
          const fullDate = dayjs(
            `${e.date} ${e.start_time ?? '00:00:00'}`,
            'YYYYMMDD HH:mm:ss'
          );

          return {
            ...e,
            startDT: fullDate,                                
            displayStart: fullDate.format('MMMM Do, YYYY [at] h:mma'), 
          };
        });

        setEvents(parsed);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load events');
      });
  }, [tableName]);

  return (
    <div className="catalog-container">
      <div className="mb-4">
        <label className="font-medium">
          Select Table:
          <select
            className="ml-2 border p-1 rounded"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          >
            <option value="events">events</option>
            <option value="events_peter_qian">events_peter_qian</option>
          </select>
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {events === null ? (
        <p>Loading events…</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="catalog-grid">
          {events.map(e => (
            <article key={e.uuid} className="event-card">
              <Link href={`/item/${e.uuid}`} className="event-link">
                {e.icon_img?.path && (
                  <img
                    src={e.icon_img.path}
                    alt={e.icon_img.alt ?? e.name}
                    className="event-detail-image"
                    style={{ maxWidth: '100%', borderRadius: '0.5rem', marginBottom: '1rem' }}
                  />
                )}

                <div className="event-info">
                  <h2 className="event-title">{e.name}</h2>

                  {/* Already formatted ↓ */}
                  <p className="event-detail">{e.displayStart}</p>

                  <p className="event-detail" style={{ fontWeight: 'bold' }}>${0}</p>
                  <p className="event-detail">{e.location}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
