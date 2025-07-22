'use client';

import { generateUploadButton, generateUploadDropzone,} from "@uploadthing/react";
import type { OurFileRouter } from "../server/uploadthing";
  
export const UploadButton   = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

type Props = {
  onAdd: (files: { url: string; name: string; size: number }[]) => void;
};

export default function UploadForm({ onAdd }: Props) {
  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <h3>Upload Image</h3>

      <UploadButton
        endpoint="imageUploader"
        appearance={{
          button: { background: '#86af49', color: '#fff', borderRadius: 4 },
        }}
        onClientUploadComplete={(res) => {
          const files = res.map(({ url, name, size }) => ({ url, name, size }));
          onAdd(files);
        }}
        onUploadError={(err) => alert(`Upload failed: ${err.message}`)}
      />
    </div>
  );
}

