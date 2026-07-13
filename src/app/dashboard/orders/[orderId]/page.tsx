import { requireShopOwner } from "@/lib/permissions/authorize";
import { getOrderById } from "@/actions/dashboard/orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { OrderStatusActions } from "@/components/dashboard/order-status-actions";
import { OrderNoteForm } from "@/components/dashboard/order-note-form";
import { Store } from "@/models/Store";
import { connectDB } from "@/lib/database/mongoose";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  await requireShopOwner();
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  await connectDB();
  const store = await Store.findOne({ ownerId: (await requireShopOwner()).user.id }).lean();

  function formatCurrency(amount: number) {
    return `Rs. ${amount.toLocaleString("en-LK")}`;
  }

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const sourceColors: Record<string, string> = {
    WEBSITE: "bg-purple-100 text-purple-800",
    WHATSAPP: "bg-green-100 text-green-800",
    MANUAL: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{order.orderId}</h1>
          <p className="text-muted-foreground">Order details</p>
        </div>
        <Badge className={statusColors[order.status]}>{order.status}</Badge>
        <Badge className={sourceColors[order.source]}>{order.source}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{order.customer.phone}</p>
            </div>
            {order.customer.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customer.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{order.customer.address}</p>
            </div>
            {order.customer.city && (
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{order.customer.city}</p>
              </div>
            )}
            {order.customer.note && (
              <div>
                <p className="text-sm text-muted-foreground">Customer Note</p>
                <p className="font-medium">{order.customer.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">{order.orderId}</p>
            </div>
            {order.externalOrderId && (
              <div>
                <p className="text-sm text-muted-foreground">External ID</p>
                <p className="font-medium">{order.externalOrderId}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <Badge className={sourceColors[order.source]}>
                {order.source}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[order.status]}>
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            {order.externalOrderId && (
              <div>
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-medium">{formatCurrency(order.subtotal)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item: { productName: string; selectedColor?: string; selectedSize?: string; selectedVariants?: Record<string, string>; quantity: number; unitPrice: number; subtotal: number }, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {item.selectedColor && (
                      <span>Colour: {item.selectedColor}</span>
                    )}
                    {item.selectedSize && (
                      <span>Size: {item.selectedSize}</span>
                    )}
                    {item.selectedVariants &&
                      Object.entries(item.selectedVariants).map(
                        ([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        )
                      )}
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(item.subtotal)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.unitPrice)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <OrderStatusActions orderId={order._id} currentStatus={order.status} />
            {order.source === "WHATSAPP" && store?.whatsappNumber && (
              <a
                href={`https://wa.me/${store.whatsappNumber.replace(/[\s+\-()]/g, "")}?text=${encodeURIComponent(`Hi, I'm following up on order ${order.orderId}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                WhatsApp Customer
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Internal Note</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderNoteForm orderId={order._id} currentNote={order.internalNote ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}
