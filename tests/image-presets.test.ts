import { describe, expect, it } from "vitest";

import {
  buildEditPrompt,
  generationInputSchema,
  getImageSize,
} from "../lib/image-presets";

describe("generation input", () => {
  it("accepts a valid mode and style combination", () => {
    const result = generationInputSchema.safeParse({
      mode: "headshot",
      style: "studio",
      strength: "balanced",
      aspectRatio: "portrait",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a style from another editing mode", () => {
    const result = generationInputSchema.safeParse({
      mode: "restore",
      style: "studio",
      strength: "subtle",
      aspectRatio: "original",
    });

    expect(result.success).toBe(false);
  });

  it("requires instructions for a custom edit", () => {
    const result = generationInputSchema.safeParse({
      mode: "custom",
      style: "precise",
      strength: "balanced",
      aspectRatio: "original",
    });

    expect(result.success).toBe(false);
  });
});

describe("edit prompt", () => {
  it("includes identity-preservation rules for headshots", () => {
    const prompt = buildEditPrompt({
      mode: "headshot",
      style: "studio",
      strength: "subtle",
      aspectRatio: "portrait",
    });

    expect(prompt).toContain("Preserve the person's exact identity");
    expect(prompt).toContain("warm light-gray seamless studio background");
    expect(prompt).toContain("restrained and very close to the input");
  });

  it("includes the user's custom request", () => {
    const prompt = buildEditPrompt({
      mode: "custom",
      style: "precise",
      strength: "balanced",
      aspectRatio: "landscape",
      customPrompt: "Replace the wall with pale green tiles",
    });

    expect(prompt).toContain(
      "User request: Replace the wall with pale green tiles",
    );
  });
});

describe("output sizing", () => {
  it("maps each UX ratio to an OpenAI-supported image size", () => {
    expect(getImageSize("original")).toBe("auto");
    expect(getImageSize("square")).toBe("1024x1024");
    expect(getImageSize("portrait")).toBe("1024x1536");
    expect(getImageSize("landscape")).toBe("1536x1024");
  });
});
