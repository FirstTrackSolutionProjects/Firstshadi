import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const uploadDirectory = path.resolve(
  process.env.UPLOAD_DIR || path.join(backendDirectory, 'uploads')
);

fs.mkdirSync(uploadDirectory, { recursive: true });
