import { requireAdmin } from "@/lib/permissions/authorize";
import { CreateStoreForm } from "@/components/admin/create-store-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewStorePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Shop Owner & Store</h1>
        <p className="text-muted-foreground">
          Create a new shop owner account and store
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateStoreForm />
        </CardContent>
      </Card>
    </div>
  );
}
