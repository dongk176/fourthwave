import { randomUUID } from "crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION =
  process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || "";
const BUCKET = (process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || "").trim();

let s3Client: S3Client | null = null;

function getS3(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: REGION,
      // Helps compatibility for buckets/endpoints where virtual-hosted style
      // resolution is restricted.
      forcePathStyle: true,
    });
  }
  return s3Client;
}

export function isS3Configured(): boolean {
  return Boolean(REGION && BUCKET);
}

export function getS3Bucket(): string {
  return BUCKET;
}

function getExtension(fileName: string): string {
  const match = fileName.toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match?.[1] || "";
}

function buildKey(type: "media" | "thumbnail", originalFileName: string): string {
  const extension = getExtension(originalFileName);
  const date = new Date();
  const yyyy = String(date.getUTCFullYear());
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const id = randomUUID();
  return `results/${type}/${yyyy}/${mm}/${id}${extension}`;
}

export function buildResultMediaKey(fileName: string): string {
  return buildKey("media", fileName);
}

export function buildResultThumbnailKey(fileName: string): string {
  return buildKey("thumbnail", fileName);
}

export async function uploadBufferToS3(input: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: input.key,
    Body: input.body,
    ContentType: input.contentType || "application/octet-stream",
    CacheControl: "public, max-age=31536000, immutable",
  });

  await getS3().send(command);
}

export async function getSignedS3ObjectUrl(
  key: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(getS3(), command, { expiresIn: expiresInSeconds });
}

export async function deleteS3ObjectByKey(key: string | null | undefined) {
  if (!key) return;
  await getS3().send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
}
