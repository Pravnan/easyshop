import { connectDB } from "@/lib/database/mongoose";
import { Order } from "@/models/Order";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: Promise<{ storeSlug: string; orderId: string }>;
}

export default async function OrderSuccessPage({ params }: Props) {
  const { storeSlug, orderId } = await params;

  await connectDB();

  const order = await Order.findOne({ orderId }).lean();

  if (!order) notFound();

  function formatCurrency(amount: number) {
    return `Rs. ${amount.toLocaleString("en-LK")}`;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4">
      <div className="mx-auto max-w-2xl py-8">
        <div className="text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 text-2xl font-bold">Order Placed!</h1>
          <p className="mb-6 text-muted-foreground">
            Your order has been received successfully.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-lg font-bold">{order.orderId}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Items</p>
              <div className="mt-1 space-y-2">
                {order.items.map((item: { productName: string; quantity: number; subtotal: number }, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3 text-lg font-bold">
              <span>Total</span>
              <span className="text-[#1565C0]">
                {formatCurrency(order.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          {order.source === "WHATSAPP" && (
            <p className="mb-4 text-sm text-muted-foreground">
              WhatsApp has been opened to send your order details.
            </p>
          )}
          <Link href={`/store/${storeSlug}`}>
            <Button className="bg-[#1565C0] hover:bg-[#0D47A1]">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
