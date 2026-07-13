"use client";

import { useRouter } from "next/navigation";
import { toggleStoreStatus } from "@/actions/admin/stores";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StoreStatusToggleProps {
  storeId: string;
  isActive: boolean;
}

export function StoreStatusToggle({ storeId, isActive }: StoreStatusToggleProps) {
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
    <Button
      variant={isActive ? "destructive" : "default"}
      onClick={handleToggle}
    >
      {isActive ? "Deactivate Store" : "Activate Store"}
    </Button>
  );
}
