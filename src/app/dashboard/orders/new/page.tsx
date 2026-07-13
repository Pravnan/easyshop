import { requireShopOwner } from "@/lib/permissions/authorize";
import { ManualOrderForm } from "@/components/dashboard/manual-order-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewOrderPage() {
  await requireShopOwner();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Manual Order</h1>
        <p className="text-muted-foreground">
          Create a manual order or lead
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ManualOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}
