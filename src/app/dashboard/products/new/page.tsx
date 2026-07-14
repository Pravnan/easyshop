import { requireShopOwner } from "@/lib/permissions/authorize";
import { getCategories } from "@/actions/dashboard/categories";
import { ProductForm } from "@/components/dashboard/product-form";

export default async function NewProductPage() {
  await requireShopOwner();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Product</h1>
        <p className="text-muted-foreground">Add a new product to your store</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
