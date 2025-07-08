// pages/item/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {dayjs, EventData} from '@jstiava/chronos'
import Link from "next/link";
import TopBar from '@/pages/TopBar';
import { Alert, Slide } from '@mui/material';

export default function EventDetail(props) {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<EventData | null>(null);
  const [qty, setQty] = useState<string>('1');
  const Cart=props.Cart
  const [user, setUser] = useState<any>(null);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        try {
            setEvent(data as EventData)
        } catch (err) {
          console.error('Failed to instantiate Event:', err);
        }
      })
      .catch(err => console.error('Failed to fetch event:', err));
  }, [id]);

  const handleAdd = () => {
    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity < 1) {
      alert("⚠️ Please enter a quantity of at least 1.");
      return;
    }

    if (event) {
      Cart.add(
        { id: event.uuid||event.name, title: event.name, price: event.price ?? 0 },
        quantity
      );
      setQty('1');
      alert(`✅ Added ${quantity} × "${event.name}" to your cart!`);
    }
  };

  if (!event) return <p>Loading…</p>;
  return (
    <>
    <TopBar/>

    {alert && (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            minWidth: '300px',
          }}
        >
          <Alert
            severity={alert.severity}
            variant="filled"
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        </div>
      </Slide>
    )}
    
    <div className="event-detail">
        {event.icon_img?.path && (
      <img
        src={event.icon_img.path}
        alt={event.icon_img.alt ?? event.name}
        className="event-detail-image"
        style={{ maxWidth: '100%', borderRadius: '0.5rem', marginBottom: '1rem' }}
      />
    )}
      <h1 className="ed-title">{event.name}</h1>


      <p className="ed-description">{event.metadata?.description}</p>

      <p className="ed-meta">
        <i className="fa-solid fa-calendar"></i>
        <span>
          {event.start_time} –{' '}
          {event.end_time}
        </span>
      </p>
      <p className="ed-meta">
        <i className="fa-solid fa-location-dot"></i>
        <span>{event.location}</span>
      </p>

      <p className="ed-price">${0}</p>

      <div className="ed-actions">
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
            className="ed-qty-input"
          />
        </label>
        <button className="add-button" onClick={handleAdd}>
          Add {(parseInt(qty, 10) || 1)} to Cart
        </button>
      </div>
    </div>
    </>
  );
}
