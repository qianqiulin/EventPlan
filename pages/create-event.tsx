import EventForm from "./components/EventForm";
import { useRouter } from 'next/router';

export default function CreateEventPage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('✅ Event created!');
      router.push('/');
    } else {
      alert('❌ Failed to create event');
    }
  };

  return <EventForm onSubmit={handleCreate} />;
}
