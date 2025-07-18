'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, Slide } from '@mui/material';
import { EventData } from '@jstiava/chronos';

type AlertState =
  | { severity: 'success' | 'error' | 'warning' | 'info'; message: string }
  | null;

interface CartStore {
  cart: { id: string | number; price: number; qty: number }[];
  add: (item: { id: string | number; title: string; price: number }, qty: number) => void;
  remove: (id: string | number, qty?: number) => void;
  clear: () => void;
}

export default function EventDetail({ Cart }: { Cart: CartStore }) {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<EventData | null>(null);
  const [qty, setQty] = useState('1');
  const [alert, setAlert] = useState<AlertState>(null);

  
  if (process.env.NODE_ENV !== 'production') {
    if (!Cart || typeof Cart.add !== 'function') {
      // eslint‑disable‑next‑line no-console
      console.error(
        '❌ <EventDetail> received an invalid Cart prop. ' +
          'Make sure the parent passes `Cart={cartStore}` with a capital C.'
      );
    }
  }

  useEffect(() => {
    if (!id) return;

    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data as EventData))
      .catch((err) => console.error('Failed to fetch event:', err));
  }, [id]);

  const handleAdd = () => {
    const quantity = parseInt(qty, 10);

    if (isNaN(quantity) || quantity < 1) {
      setAlert({ severity: 'warning', message: '⚠️ Please enter a quantity of at least 1.' });
      return;
    }

    if (event) {
      Cart.add(
        { id: event.uuid || event.name, title: event.name, price: event.price ?? 0 },
        quantity
      );

      setQty('1');
      setAlert({
        severity: 'success',
        message: `✅ Added ${quantity} × "${event.name}" to your cart!`,
      });

      setTimeout(() => setAlert(null), 3000);
    }
  };

  if (!event) return <p>Loading…</p>;

  return (
    <>
      {/* Toast / Snackbar */}
      {alert && (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, minWidth: 300 }}>
            <Alert severity={alert.severity} variant="filled" onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          </div>
        </Slide>
      )}

      {/* Event content */}
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        {event.icon_img?.path && (
          <img
            src={event.icon_img.path}
            alt={event.icon_img.alt ?? event.name}
            style={{ maxWidth: '100%', borderRadius: '0.5rem' }}
          />
        )}

        <h1>{event.name}</h1>

        <p style={{ textAlign: 'center' }}>{event.metadata?.description}</p>

        <p>
          <strong>Date:</strong> {event.date ?? event.start_time?.split('T')[0]}
        </p>
        <p>
          <strong>Start:</strong> {event.start_time}
        </p>
        <p>
          <strong>End:</strong> {event.end_time}
        </p>
        <p>
          <strong>Venue:</strong> {event.location}
        </p>

        <p style={{ fontSize: '1.25rem' }}>
          <strong>Price:</strong> ${event.price ?? 0}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label>
            Qty:{' '}
            <input
              type="text"
              value={qty}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '' || /^[0-9\b]+$/.test(v)) setQty(v);
              }}
              onFocus={(e) => e.target.select()}
              style={{
                width: 50,
                textAlign: 'center',
                padding: '0.25rem 0.5rem',
                borderRadius: 4,
              }}
            />
          </label>

          <button onClick={handleAdd} style={{ padding: '0.5rem 1rem', borderRadius: 4 }}>
            Add {(parseInt(qty, 10) || 1)} to Cart
          </button>
        </div>
      </div>
    </>
  );
}
