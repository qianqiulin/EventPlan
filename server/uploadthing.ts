// server/uploadthing.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// ─────────────────────────────────────────────────────────────
// One FileRoute called “imageUploader”
// – accepts ONE image ≤ 4 MB
// – no auth / middleware for now
// ─────────────────────────────────────────────────────────────
export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("File uploaded:", file.ufsUrl);   // url key is ufsUrl in legacy
    return { fileUrl: file.ufsUrl };              // sent back to client
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
