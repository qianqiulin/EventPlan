import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { Database } from 'sqlite';

sqlite3.verbose();

export async function openDb(): Promise<Database> {
  const dbPath = path.join(process.cwd(), 'db.sqlite3'); // fixed filename and path

  console.log('Resolved DB path:', dbPath);

  if (!fs.existsSync(dbPath)) {
    throw new Error(`❌ Database file not found at: ${dbPath}`);
  }

  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}
