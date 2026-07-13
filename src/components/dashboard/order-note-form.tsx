"use client";

import { useRouter } from "next/navigation";
import { updateInternalNote } from "@/actions/dashboard/orders";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

interface OrderNoteFormProps {
  orderId: string;
  currentNote: string;
}

export function OrderNoteForm({ orderId, currentNote }: OrderNoteFormProps) {
  const router = useRouter();
  const [note, setNote] = useState(currentNote);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateInternalNote(orderId, note);
      toast.success("Note saved");
      router.refresh();
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add an internal note..."
        rows={4}
      />
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Note"}
      </Button>
    </div>
  );
}
