import { requireShopOwner } from "@/lib/permissions/authorize";
import { getOrders } from "@/actions/dashboard/orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { OrderActions } from "@/components/dashboard/order-actions";
import { OrderSourceBadge } from "@/components/dashboard/order-source-badge";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";

interface Props {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  await requireShopOwner();
  const params = await searchParams;
  const orders = await getOrders(params.status, params.search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders & Leads</h1>
          <p className="text-muted-foreground">Manage all orders and enquiries</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="bg-[#1565C0] hover:bg-[#0D47A1]">
            <Plus className="mr-1 h-4 w-4" />
            Manual Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Orders</CardTitle>
            <form className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search orders..."
                  className="pl-8"
                  defaultValue={params.search}
                />
              </div>
              <select
                name="status"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={params.status ?? "all"}
              >
                <option value="all">All Status</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Button type="submit" variant="outline" size="sm">
                Filter
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No orders found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    <TableCell>
                      Rs. {order.total.toLocaleString("en-LK")}
                    </TableCell>
                    <TableCell>
                      <OrderSourceBadge source={order.source} />
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <OrderActions orderId={order._id} status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
