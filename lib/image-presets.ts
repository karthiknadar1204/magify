import { z } from "zod";

export const editModes = [
  "enhance",
  "headshot",
  "product",
  "restore",
  "custom",
] as const;
export const strengths = ["subtle", "balanced", "strong"] as const;
export const aspectRatios = [
  "original",
  "square",
  "portrait",
  "landscape",
] as const;

export type EditMode = (typeof editModes)[number];
export type EditStrength = (typeof strengths)[number];
export type AspectRatio = (typeof aspectRatios)[number];

type StylePreset = {
  id: string;
  label: string;
  description: string;
  instruction: string;
};

type ModePreset = {
  label: string;
  shortLabel: string;
  description: string;
  styles: readonly StylePreset[];
  instruction: string;
};

export const modePresets: Record<EditMode, ModePreset> = {
  enhance: {
    label: "Enhance photo",
    shortLabel: "Enhance",
    description: "Balanced light, colour, clarity, and natural detail.",
    instruction:
      "Improve the photograph's lighting, white balance, dynamic range, natural sharpness, and fine detail. Reduce distracting noise and compression artifacts.",
    styles: [
      {
        id: "natural",
        label: "Natural",
        description: "True-to-life and quietly polished",
        instruction:
          "Keep the colour palette true to life with restrained contrast and realistic texture.",
      },
      {
        id: "vivid",
        label: "Vivid",
        description: "Richer colour with crisp contrast",
        instruction:
          "Use richer but believable colour, clearer separation, and confident contrast without an HDR look.",
      },
      {
        id: "soft",
        label: "Soft light",
        description: "Gentle light and calm tones",
        instruction:
          "Use soft diffused light, graceful highlight rolloff, and calm editorial colour.",
      },
    ],
  },
  headshot: {
    label: "Professional headshot",
    shortLabel: "Headshot",
    description: "Studio-quality portraits that still look like you.",
    instruction:
      "Create a polished professional portrait from the input. Preserve the person's exact identity, facial features, skin tone, age, expression, body proportions, hairstyle, and recognizable details. Use realistic skin texture and physically plausible light.",
    styles: [
      {
        id: "studio",
        label: "Clean studio",
        description: "Neutral background and soft key light",
        instruction:
          "Place the subject against a warm light-gray seamless studio background with soft professional key and fill lighting.",
      },
      {
        id: "office",
        label: "Modern office",
        description: "Professional with subtle depth",
        instruction:
          "Use a tasteful modern office background with shallow depth of field and natural window light.",
      },
      {
        id: "editorial",
        label: "Editorial",
        description: "Premium magazine-style portrait",
        instruction:
          "Use refined editorial portrait lighting, a minimal dark-neutral backdrop, and sophisticated but realistic tonal contrast.",
      },
    ],
  },
  product: {
    label: "Product studio",
    shortLabel: "Product",
    description: "Listing-ready product photography in seconds.",
    instruction:
      "Create a premium product photograph. Preserve the product's exact shape, materials, colours, logos, printed text, labels, proportions, and identifying details. Improve only the presentation, lighting, background, and composition.",
    styles: [
      {
        id: "clean",
        label: "Clean white",
        description: "Marketplace-ready studio image",
        instruction:
          "Use a clean warm-white studio background, centered composition, soft contact shadow, and bright even commercial lighting.",
      },
      {
        id: "premium",
        label: "Premium",
        description: "Dramatic luxury campaign",
        instruction:
          "Use a refined dark-to-neutral gradient set, controlled rim lighting, elegant reflections, and a premium advertising finish.",
      },
      {
        id: "lifestyle",
        label: "Lifestyle",
        description: "Natural, contextual product scene",
        instruction:
          "Place the product in a believable tasteful lifestyle setting appropriate to its use, with natural light and clear visual focus on the product.",
      },
    ],
  },
  restore: {
    label: "Restore old photo",
    shortLabel: "Restore",
    description: "Repair age and damage while preserving the memory.",
    instruction:
      "Faithfully restore this old or damaged photograph. Repair scratches, tears, dust, stains, fading, blur, and missing minor detail. Preserve every person's identity, age, expression, clothing, pose, and the original historical character of the image.",
    styles: [
      {
        id: "faithful",
        label: "Faithful restore",
        description: "Keep the original colour treatment",
        instruction:
          "Retain the photograph's original black-and-white, sepia, or colour treatment while making it clean and legible.",
      },
      {
        id: "colorize",
        label: "Natural colour",
        description: "Historically plausible colourisation",
        instruction:
          "Add restrained, historically plausible natural colour while preserving the period feel and realistic skin tones.",
      },
      {
        id: "monochrome",
        label: "Crisp monochrome",
        description: "Refined black-and-white finish",
        instruction:
          "Render as a clean, tonally rich black-and-white photograph with natural grain and restored contrast.",
      },
    ],
  },
  custom: {
    label: "Custom edit",
    shortLabel: "Custom",
    description: "Describe the precise change you want.",
    instruction:
      "Perform the user's requested edit precisely. Preserve all people, objects, text, layout, identity, and visual details that the request does not explicitly ask to change.",
    styles: [
      {
        id: "precise",
        label: "Precise edit",
        description: "Change only what you describe",
        instruction:
          "Make the requested change seamless, photorealistic, and consistent with the original image's perspective, lighting, and texture.",
      },
    ],
  },
};

export const generationInputSchema = z
  .object({
    mode: z.enum(editModes),
    style: z.string().min(1).max(40),
    strength: z.enum(strengths),
    aspectRatio: z.enum(aspectRatios),
    customPrompt: z.string().trim().max(600).optional(),
  })
  .superRefine((value, context) => {
    const validStyle = modePresets[value.mode].styles.some(
      (style) => style.id === value.style,
    );

    if (!validStyle) {
      context.addIssue({
        code: "custom",
        path: ["style"],
        message: "Choose a valid style for this tool.",
      });
    }

    if (value.mode === "custom" && !value.customPrompt?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["customPrompt"],
        message: "Describe the edit you want.",
      });
    }
  });

export type GenerationInput = z.infer<typeof generationInputSchema>;

const strengthInstructions: Record<EditStrength, string> = {
  subtle:
    "Keep the edit restrained and very close to the input. Prefer small, natural improvements.",
  balanced:
    "Apply a noticeable but believable professional edit. Avoid an artificial or overprocessed result.",
  strong:
    "Apply a confident transformation while keeping the subject recognizable, realistic, and visually coherent.",
};

export function buildEditPrompt(input: GenerationInput) {
  const mode = modePresets[input.mode];
  const style = mode.styles.find((candidate) => candidate.id === input.style);

  if (!style) {
    throw new Error("Invalid style preset.");
  }

  const userInstruction = input.customPrompt?.trim()
    ? `User request: ${input.customPrompt.trim()}`
    : null;

  return [
    "Edit the supplied image as a single polished photograph.",
    mode.instruction,
    style.instruction,
    strengthInstructions[input.strength],
    userInstruction,
    "Keep anatomy, perspective, shadows, reflections, grain, and texture physically plausible.",
    "Do not add watermarks, borders, captions, signatures, or unrelated objects.",
    "Return only the finished image.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function getImageSize(aspectRatio: AspectRatio) {
  const sizes = {
    original: "auto",
    square: "1024x1024",
    portrait: "1024x1536",
    landscape: "1536x1024",
  } as const;

  return sizes[aspectRatio];
}
