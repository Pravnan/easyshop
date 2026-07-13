"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus, updateInternalNote } from "@/actions/dashboard/orders";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { OrderStatus } from "@/models/Order";

interface OrderActionsProps {
  orderId: string;
  status: string;
}

export function OrderActions({ orderId, status }: OrderActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <Link href={`/dashboard/orders/${orderId}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const router = useRouter();

  async function handleStatusChange(status: OrderStatus, label: string) {
    if (
      (status === "CANCELLED" || status === "COMPLETED") &&
      !window.confirm(`Are you sure you want to mark this order as ${label.toLowerCase()}?`)
    ) {
      return;
    }

    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${label}`);
      router.refresh();
    } catch {
      toast.error("Failed to update order status");
    }
  }

  const nextActions: { status: OrderStatus; label: string; variant: "default" | "outline" | "destructive" }[] = [];

  if (currentStatus === "NEW") {
    nextActions.push({ status: "CONTACTED", label: "Mark Contacted", variant: "outline" });
  }
  if (currentStatus === "NEW" || currentStatus === "CONTACTED") {
    nextActions.push({ status: "CONFIRMED", label: "Confirm Order", variant: "default" });
  }
  if (currentStatus === "CONFIRMED") {
    nextActions.push({ status: "COMPLETED", label: "Mark Completed", variant: "default" });
  }
  if (currentStatus !== "CANCELLED" && currentStatus !== "COMPLETED") {
    nextActions.push({ status: "CANCELLED", label: "Cancel Order", variant: "destructive" });
  }

  return (
    <>
      {nextActions.map((action) => (
        <Button
          key={action.status}
          variant={action.variant}
          size="sm"
          onClick={() => handleStatusChange(action.status, action.label)}
        >
          {action.label}
        </Button>
      ))}
    </>
  );
}
