// pages/catalog.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';
import {dayjs,EventData} from "@jstiava/chronos";

const Catalog: NextPage = () => {
  const [events, setEvents] = useState<EventData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load events');
      });
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (events === null) return <p>Loading events…</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
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
              {e.start_time} –{' '}
              {e.end_time}
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
  );
};

export default Catalog;
