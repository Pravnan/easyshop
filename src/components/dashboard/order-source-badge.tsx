import { Badge } from "@/components/ui/badge";
import type { OrderSource } from "@/models/Order";

const sourceStyles: Record<OrderSource, string> = {
  WEBSITE: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  WHATSAPP: "bg-green-100 text-green-800 hover:bg-green-100",
  MANUAL: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

export function OrderSourceBadge({ source }: { source: string }) {
  return (
    <Badge className={sourceStyles[source as OrderSource] ?? ""}>
      {source}
    </Badge>
  );
}
