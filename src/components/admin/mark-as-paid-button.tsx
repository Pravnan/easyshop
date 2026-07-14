"use client";

import { useRouter } from "next/navigation";
import { markStoreAsPaid } from "@/actions/admin/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface MarkAsPaidButtonProps {
  storeId: string;
  paidAt?: string;
  paymentPending?: boolean;
  trialEndsAt?: string;
}

export function MarkAsPaidButton({ storeId, paidAt, paymentPending, trialEndsAt }: MarkAsPaidButtonProps) {
  const router = useRouter();

  if (paidAt) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        Paid on {new Date(paidAt).toLocaleDateString()}
      </div>
    );
  }

  async function handleMarkPaid() {
    try {
      await markStoreAsPaid(storeId);
      toast.success("Store marked as paid");
      router.refresh();
    } catch {
      toast.error("Failed to mark as paid");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
          Trial
        </Badge>
        {trialEndsAt && (
          <span className="text-sm text-muted-foreground">
            Trial ends: {new Date(trialEndsAt).toLocaleDateString()}
            {new Date(trialEndsAt) < new Date() && " (expired)"}
          </span>
        )}
      </div>
      <Button onClick={handleMarkPaid} variant="default" className="bg-green-600 hover:bg-green-700">
        <CreditCard className="mr-1 h-4 w-4" />
        Mark as Paid
      </Button>
    </div>
  );
}
