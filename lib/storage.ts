import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const localMediaRoot = path.join(process.cwd(), ".local-media");

function hasR2Configuration() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME,
  );
}

function getR2Client() {
  if (!hasR2Configuration()) {
    throw new Error("Cloudflare R2 credentials are not configured.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function getBucketName() {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not configured.");
  }

  return bucketName;
}

function getSafeLocalPath(key: string) {
  const resolved = path.resolve(localMediaRoot, key);
  const root = `${path.resolve(localMediaRoot)}${path.sep}`;

  if (!resolved.startsWith(root)) {
    throw new Error("Invalid media key.");
  }

  return resolved;
}

export function getStorageDriver() {
  return hasR2Configuration() ? "r2" : "local";
}

export async function putMedia(
  key: string,
  body: Buffer,
  contentType: string,
) {
  if (hasR2Configuration()) {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: getBucketName(),
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "private, max-age=3600",
      }),
    );
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Cloudflare R2 must be configured in production.");
  }

  const destination = getSafeLocalPath(key);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, body);
}

export async function readMedia(key: string) {
  if (hasR2Configuration()) {
    const result = await getR2Client().send(
      new GetObjectCommand({
        Bucket: getBucketName(),
        Key: key,
      }),
    );

    if (!result.Body) {
      throw new Error("Stored media is empty.");
    }

    return Buffer.from(await result.Body.transformToByteArray());
  }

  return readFile(getSafeLocalPath(key));
}

export async function deleteMedia(key: string) {
  if (hasR2Configuration()) {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: getBucketName(),
        Key: key,
      }),
    );
    return;
  }

  await rm(getSafeLocalPath(key), { force: true });
}
