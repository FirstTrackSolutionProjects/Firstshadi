import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

function getConfig() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const publicBaseUrl = process.env.AWS_S3_PUBLIC_URL?.replace(/\/+$/, '')
    || (region && bucket ? `https://${bucket}.s3.${region}.amazonaws.com` : null);
  if (!region || !bucket || !publicBaseUrl) {
    throw new Error('S3 is not configured. Set AWS_REGION and AWS_S3_BUCKET.');
  }
  return { bucket, publicBaseUrl, client: new S3Client({ region }) };
}

export async function uploadProfilePhoto(file, userId) {
  const { bucket, publicBaseUrl, client } = getConfig();

  const extension = path.extname(file.originalname).toLowerCase();
  const key = `profiles/${userId}/${randomUUID()}${extension}`;
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return `${publicBaseUrl}/${key.split('/').map(encodeURIComponent).join('/')}`;
}

export async function deleteProfilePhoto(photoUrl) {
  if (typeof photoUrl !== 'string') return;
  const { bucket, publicBaseUrl, client } = getConfig();
  const prefix = `${publicBaseUrl}/`;
  if (!photoUrl.startsWith(prefix)) return; // Legacy /uploads URLs remain untouched.

  const key = decodeURIComponent(photoUrl.slice(prefix.length));
  if (!key.startsWith('profiles/')) return;
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
