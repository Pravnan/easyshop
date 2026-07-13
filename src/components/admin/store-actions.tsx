"use client";

import { useRouter } from "next/navigation";
import { toggleStoreStatus } from "@/actions/admin/stores";
import { Button } from "@/components/ui/button";
import { Eye, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface StoreActionsProps {
  storeId: string;
  isActive: boolean;
}

export function StoreActions({ storeId, isActive }: StoreActionsProps) {
  const router = useRouter();

  async function handleToggle() {
    try {
      const result = await toggleStoreStatus(storeId);
      toast.success(
        result.isActive ? "Store activated" : "Store deactivated"
      );
      router.refresh();
    } catch {
      toast.error("Failed to update store status");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/stores/${storeId}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleToggle}>
        {isActive ? (
          <ToggleRight className="h-4 w-4 text-green-600" />
        ) : (
          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
