import "server-only";

import OpenAI, { toFile } from "openai";
import sharp from "sharp";

import {
  buildEditPrompt,
  getImageSize,
  type GenerationInput,
} from "./image-presets";

let openAIClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  openAIClient ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openAIClient;
}

async function createLocalTestResult(
  inputImage: Buffer,
  input: GenerationInput,
) {
  const targetSize = {
    original: null,
    square: { width: 1024, height: 1024 },
    portrait: { width: 1024, height: 1536 },
    landscape: { width: 1536, height: 1024 },
  }[input.aspectRatio];

  let pipeline = sharp(inputImage).rotate();

  if (targetSize) {
    pipeline = pipeline.resize({
      ...targetSize,
      fit: "cover",
      position: "attention",
    });
  }

  const label = Buffer.from(`
    <svg width="220" height="38" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="38" rx="19" fill="rgba(20,18,26,.78)" />
      <text x="110" y="25" text-anchor="middle" fill="white" font-size="11" font-family="Arial, sans-serif" letter-spacing="1.4">LOCAL TEST RESULT</text>
    </svg>
  `);

  return pipeline
    .modulate({ brightness: 1.04, saturation: 1.08 })
    .sharpen({ sigma: 0.8 })
    .composite([{ input: label, gravity: "southeast", blend: "over" }])
    .webp({ quality: 90 })
    .toBuffer();
}

export async function editImageWithOpenAI(
  inputImage: Buffer,
  input: GenerationInput,
) {
  if (
    process.env.MAGNIFY_MOCK_AI === "true" &&
    process.env.NODE_ENV !== "production"
  ) {
    return createLocalTestResult(inputImage, input);
  }

  const response = await getOpenAIClient().images.edit({
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst",
    image: await toFile(inputImage, "magnify-input.webp", {
      type: "image/webp",
    }),
    prompt: buildEditPrompt(input),
    size: getImageSize(input.aspectRatio),
    quality: "medium",
    output_format: "webp",
    output_compression: 90,
  });

  const encodedImage = response.data?.[0]?.b64_json;

  if (!encodedImage) {
    throw new Error("OpenAI returned an empty image result.");
  }

  return Buffer.from(encodedImage, "base64");
}
