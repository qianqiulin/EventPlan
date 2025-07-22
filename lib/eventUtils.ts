import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

export type UIEvent = {
  id: string | number;
  name: string;
  location?: string | null;
  price?: number | null;
  icon_img?: { path: string; alt?: string } | null;
  metadata?: { description?: string };
  displayDate: string;
  displayStart: string;
  displayEnd: string;
  startDT: dayjs.Dayjs | null;
  endDT: dayjs.Dayjs | null;
  // keep the rest of the raw fields if you need them:
  [k: string]: any;
};

const clean = (v: any) =>
  v !== null && v !== undefined && v !== '' && v !== 'NaN' && v !== 'null'
    ? String(v)
    : undefined;

export function toUIEvent(raw: any): UIEvent {
  const dateRaw  = clean(raw.event_date ?? raw.date);
  const startRaw = clean(raw.start_time);
  const endRaw   = clean(raw.end_time);

  const dateObj = dateRaw
    ? dayjs(dateRaw, dateRaw.includes('-') ? 'YYYY-MM-DD' : 'YYYYMMDD')
    : null;

  const base = dateObj ? dateObj.format('YYYYMMDD') : '';

  const startDT = dateObj && startRaw
    ? dayjs(`${base} ${startRaw}`, 'YYYYMMDD HH:mm:ss')
    : null;

  const endDT = dateObj && endRaw
    ? dayjs(`${base} ${endRaw}`, 'YYYYMMDD HH:mm:ss')
    : null;

  return {
    ...raw,
    id: raw.uuid ?? raw.event_id ?? raw.id,
    icon_img: raw.image_url
      ? { path: raw.image_url, alt: raw.name }
      : raw.icon_img ?? null,
    metadata: raw.metadata ?? { description: raw.description },
    displayDate: dateObj ? dateObj.format('MMMM Do, YYYY') : 'Date TBA',
    displayStart: startDT ? startDT.format('h:mma') : 'Not specified',
    displayEnd: endDT ? endDT.format('h:mma') : 'Not specified',
    startDT,
    endDT,
  };
}
