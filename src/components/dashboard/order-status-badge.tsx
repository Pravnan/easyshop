import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/models/Order";

const statusStyles: Record<OrderStatus, string> = {
  NEW: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  CONTACTED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  CONFIRMED: "bg-green-100 text-green-800 hover:bg-green-100",
  COMPLETED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusStyles[status as OrderStatus] ?? ""}>
      {status}
    </Badge>
  );
}
