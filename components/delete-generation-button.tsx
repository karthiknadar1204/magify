"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function DeleteGenerationButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this edit and its images? This cannot be undone.",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("This edit could not be deleted.");
      }

      toast.success("Edit deleted.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      toast.error(
        error instanceof Error ? error.message : "This edit could not be deleted.",
      );
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-11 rounded-full px-4"
    >
      {isDeleting ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
      {isDeleting ? "Deleting…" : "Delete edit"}
    </Button>
  );
}
