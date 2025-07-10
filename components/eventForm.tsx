'use client';
import React, { useEffect, useState } from 'react';
import UploadForm from './UploadForm';

type FormState = {
  name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string; 
  info: string;
  image_url: string;
};

export default function EventForm({
  onSubmit,
  initialData = null,
}: {
  onSubmit: (data: FormState) => void;
  initialData?: any;
}) {
  const [form, setForm] = useState<FormState>({
    name: initialData?.name ?? '',
    event_date: initialData?.event_date ?? '',
    start_time: initialData?.start_time ?? '',
    end_time: initialData?.end_time ?? '',
    location: initialData?.location ?? '',
    info: initialData?.info ?? '',
    image_url:  initialData?.image_url ?? '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? '',
        event_date: initialData.event_date ?? '',
        start_time: initialData.start_time ?? '',
        end_time: initialData.end_time   ?? '',
        location: initialData.location   ?? '',
        info: initialData.info       ?? '',
        image_url: initialData.image_url  ?? '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleUpload = (f: { url: string }[]) =>
    f.length && setForm(p => ({ ...p, image_url: f[0].url }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto', display:'flex', flexDirection:'column', gap:8 }}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Event Name" required />
      <input name="event_date" value={form.event_date} onChange={handleChange} type="date" required />
      <input name="start_time" value={form.start_time} onChange={handleChange} placeholder="Start Time" required />
      <input name="end_time" value={form.end_time} onChange={handleChange} placeholder="End Time" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <textarea name="info" value={form.info} onChange={handleChange} placeholder="Event Info" required />

      <p style={{ margin: '8px 0 0' }}>Upload Event Image:</p>
      <UploadForm onAdd={handleUpload} />

      {form.image_url && <img src={form.image_url} style={{ maxWidth: 200, marginTop: 8 }} />}

      <button type="submit" style={{ marginTop: 12 }}>Submit</button>
    </form>
  );
}
