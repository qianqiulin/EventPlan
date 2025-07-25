'use client';
import { useEffect, useState, useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import EventForm from '@/components/eventForm';

type Event = {
  id: string;
  name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  info: string;
  image_url: string;
};

// Normalize whatever the API gives back into our Event shape
const normalize = (e: any): Event => ({
  id: e.id ?? e.event_id ?? e.uuid, //talk to jeremy about this
  name: e.name,
  event_date: e.event_date ?? e.date,
  start_time: e.start_time ?? '',
  end_time: e.end_time ?? '',
  location: e.location ?? '',
  info: e.metadata?.description ?? e.info ?? '',
  image_url: e.icon_img?.path ?? e.image_url ?? '',
});

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const isEditing = Boolean(selected);

  const refresh = useCallback(
    () =>
      fetch('/api/events', { cache: 'no-store' })
        .then(r => r.json())
        .then((data) => setEvents(data.map(normalize))),
    []
  );

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const handleCreate = async (data: Partial<Event>) => {
    const ok = await fetch('/api/events/create', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    }).then(r => r.ok);

    ok
      ? (enqueueSnackbar('Event created!', { variant: 'success' }), refresh())
      :  enqueueSnackbar('Something went wrong.', { variant: 'error' });
  };

  const handleUpdate = async (data: Partial<Event>) => {
    if (!selected) return;
    const ok = await fetch(`/api/events/${selected.id}`, {
      method : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    }).then(r => r.ok);

    ok
      ? (enqueueSnackbar('Event updated!', { variant: 'success' }),
         setSelected(null), refresh())
      :  enqueueSnackbar('Something went wrong.', { variant: 'error' });
  };

  const handleDelete = async (ev: Event) => {
    if (!confirm(`Delete "${ev.name}"?`)) return;
    const ok = await fetch(`/api/events/${ev.id}`, { method: 'DELETE' }).then(r => r.ok);

    ok
      ? (enqueueSnackbar('Event deleted!', { variant: 'success' }), refresh())
      :  enqueueSnackbar('Something went wrong.', { variant: 'error' });
  };

  if (!ready) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>

      <h2>Existing Events</h2>
      {events.length === 0 && <p>No events yet.</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {events.map(ev => (
          <div
            key={ev.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,.06)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{ev.name}</h3>
            <p style={{ fontSize: 14, color: '#666' }}>
              {ev.event_date} — {ev.location}
            </p>
            <div>
              <button onClick={() => setSelected(ev)} style={{ marginRight: 8 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(ev)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
      <EventForm
        initialData={selected}
        onSubmit={isEditing ? handleUpdate : handleCreate}
      />
      {isEditing && (
        <p>
          <button onClick={() => setSelected(null)}>Cancel edit</button>
        </p>
      )}
    </div>
  );
}
