import { requireShopOwner } from "@/lib/permissions/authorize";
import { getProductById } from "@/actions/dashboard/products";
import { getCategories } from "@/actions/dashboard/categories";
import { ProductForm } from "@/components/dashboard/product-form";

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({ params }: Props) {
  await requireShopOwner();
  const { productId } = await params;
  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
