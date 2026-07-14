import { requireShopOwner } from "@/lib/permissions/authorize";
import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";
import { ThemeSelector } from "@/components/dashboard/theme-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ThemePage() {
  const session = await requireShopOwner();
  await connectDB();
  const store = await Store.findById(session.user.storeId).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Store Theme</h1>
        <p className="text-muted-foreground">Choose a design template for your storefront</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Select Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSelector
            currentTheme={store?.theme ?? "ocean-blue"}
            storeId={(store?._id as string)?.toString() ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
