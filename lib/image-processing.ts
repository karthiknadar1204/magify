import sharp, { type Metadata } from "sharp";

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

export function validateUpload(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as never)) {
    throw new ImageValidationError("Upload a JPG, PNG, or WebP image.");
  }

  if (file.size === 0) {
    throw new ImageValidationError("The uploaded image is empty.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageValidationError("Images must be smaller than 12 MB.");
  }
}

export async function normalizeUpload(input: Buffer) {
  let metadata: Metadata;

  try {
    metadata = await sharp(input, { failOn: "error" }).metadata();
  } catch {
    throw new ImageValidationError(
      "We could not read this image. Try exporting it again as JPG or PNG.",
    );
  }

  if (!metadata.width || !metadata.height) {
    throw new ImageValidationError("The image dimensions could not be detected.");
  }

  if (metadata.width < 256 || metadata.height < 256) {
    throw new ImageValidationError(
      "Use an image that is at least 256 × 256 pixels.",
    );
  }

  if (metadata.width * metadata.height > 40_000_000) {
    throw new ImageValidationError("The image dimensions are too large.");
  }

  const { data, info } = await sharp(input)
    .rotate()
    .resize({
      width: 2560,
      height: 2560,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 94, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    width: info.width,
    height: info.height,
    mimeType: "image/webp" as const,
  };
}

export async function createResultPreview(input: Buffer) {
  return sharp(input)
    .resize({ width: 1200, height: 1200, fit: "inside" })
    .webp({ quality: 78, smartSubsample: true })
    .toBuffer();
}

export async function getImageDimensions(input: Buffer) {
  const metadata = await sharp(input).metadata();

  return {
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  };
}
