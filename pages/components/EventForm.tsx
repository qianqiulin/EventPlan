import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export interface EventFormProps {
  initialData?: {
    id?: string;
    name: string;
    location: string;
    start_time: string;
    end_time: string;
    description?: string;
  };
  onSubmit: (eventData: any) => void;
  isEditing?: boolean;
}

export default function EventForm({ initialData, onSubmit, isEditing = false }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_time: '',
    end_time: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Update Event' : 'Create Event'}
      </Typography>
      <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Location" name="location" value={formData.location} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Start Time" name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth margin="normal" label="End Time" name="end_time" type="datetime-local" value={formData.end_time} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        {isEditing ? 'Update' : 'Create'}
      </Button>
    </Box>
  );
}
