import { ImageEditor } from "@/components/image-editor";

export const metadata = { title: "New edit" };

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          New edit
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          What should this photo become?
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Upload one photo, choose the outcome, and leave the complicated prompt to Magify.
        </p>
      </div>

      <ImageEditor />
    </div>
  );
}
