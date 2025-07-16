import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';
import { dayjs, EventData } from "@jstiava/chronos";

const Catalog: NextPage = () => {
  const [tableName, setTableName] = useState('events');
  const [events, setEvents] = useState<EventData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEvents(null); // show loading state on table change
    fetch(`/api/events?table=${tableName}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => {
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
          {events.map((e) => (
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
                  <p className="event-detail">
                    {e.start_time} – {e.end_time}
                  </p>
                  <p className="event-detail" style={{ fontWeight: 'bold' }}>
                    ${0}
                  </p>
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
