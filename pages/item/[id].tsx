'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, Slide } from '@mui/material';
import { toUIEvent, UIEvent } from '@/lib/eventUtils';

type AlertState =
  | { severity: 'success' | 'error' | 'warning' | 'info'; message: string }
  | null;

interface CartStore {
  cart:{ id: string | number; price: number; qty: number }[];
  add: (item: { id: string | number; title: string; price: number }, qty: number) => void;
  remove: (id: string | number, qty?: number) => void;
  clear: () => void;
}

export interface Ticket {
  category_id: number;
  id: number; 
  price: number;
  total_quantity: number;
  available_quantity: number;
  ticket_types: any; // Assuming ticket types are stored as a string
}

export default function EventDetail({ Cart }: { Cart: CartStore }) {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<UIEvent | null>(null);
  const [qty, setQty] = useState('1');
  const [alert, setAlert] = useState<AlertState>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!router.isReady || !id) return;

    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((raw) => setEvent(toUIEvent(raw)))
      .catch((err) => console.error('Failed to fetch event:', err));
  }, [router.isReady, id]);

  const handleAdd = () => {
    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity < 1) {
      setAlert({ severity: 'warning', message: '⚠️ Please enter a quantity of at least 1.' });
      return;
    }
    if (event) {
      Cart.add({ id: event.id, title: event.name, price: event.price ?? 0 }, quantity);
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
      {alert && (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, minWidth: 300 }}>
            <Alert severity={alert.severity} variant="filled" onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          </div>
        </Slide>
      )}

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
            style={{
              width: '100%',
              maxWidth: 600,
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              borderRadius: '0.5rem',
            }}
          />
        )}

        <h1>{event.name}</h1>

        <p style={{ textAlign: 'center' }}>{event.metadata?.description}</p>

        <p><strong>Date:</strong> {event.displayDate}</p>
        <p><strong>Start:</strong> {event.displayStart}</p>
        <p><strong>End:</strong> {event.displayEnd}</p>
        <p><strong>Venue:</strong> {event.location}</p>

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
              style={{ width: 50, textAlign: 'center', padding: '0.25rem 0.5rem', borderRadius: 4 }}
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
