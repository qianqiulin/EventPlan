import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import EventForm from '../components/EventForm';

export default function UpdateEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => setInitialData(data));
  }, [id]);

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('✅ Event updated!');
      router.push('/');
    } else {
      alert('❌ Failed to update event');
    }
  };

  if (!initialData) return <p>Loading…</p>;

  return <EventForm initialData={initialData} onSubmit={handleUpdate} isEditing />;
}
