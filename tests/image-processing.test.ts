import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  createResultPreview,
  ImageValidationError,
  normalizeUpload,
  validateUpload,
} from "../lib/image-processing";

describe("image upload validation", () => {
  it("accepts a supported image", () => {
    const file = new File([new Uint8Array([1, 2, 3])], "photo.jpg", {
      type: "image/jpeg",
    });

    expect(() => validateUpload(file)).not.toThrow();
  });

  it("rejects unsupported files", () => {
    const file = new File(["not an image"], "photo.gif", {
      type: "image/gif",
    });

    expect(() => validateUpload(file)).toThrow(ImageValidationError);
  });
});

describe("image normalization", () => {
  it("normalizes uploads to a bounded WebP image", async () => {
    const source = await sharp({
      create: {
        width: 3200,
        height: 1800,
        channels: 3,
        background: "#c8b6ff",
      },
    })
      .png()
      .toBuffer();

    const normalized = await normalizeUpload(source);

    expect(normalized.mimeType).toBe("image/webp");
    expect(normalized.width).toBe(2560);
    expect(normalized.height).toBe(1440);
  });

  it("rejects images that are too small", async () => {
    const source = await sharp({
      create: {
        width: 120,
        height: 120,
        channels: 3,
        background: "#ffffff",
      },
    })
      .png()
      .toBuffer();

    await expect(normalizeUpload(source)).rejects.toThrow(
      "at least 256 × 256 pixels",
    );
  });

  it("creates a compact preview", async () => {
    const source = await sharp({
      create: {
        width: 1800,
        height: 1200,
        channels: 3,
        background: "#111827",
      },
    })
      .webp()
      .toBuffer();

    const preview = await createResultPreview(source);
    const metadata = await sharp(preview).metadata();

    expect(metadata.width).toBe(1200);
    expect(metadata.height).toBe(800);
    expect(metadata.format).toBe("webp");
  });
});
