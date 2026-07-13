import { requireShopOwner } from "@/lib/permissions/authorize";
import { getCategories } from "@/actions/dashboard/categories";
import { CategoryManager } from "@/components/dashboard/category-manager";

export default async function CategoriesPage() {
  await requireShopOwner();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Manage your store categories (max 5)
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
