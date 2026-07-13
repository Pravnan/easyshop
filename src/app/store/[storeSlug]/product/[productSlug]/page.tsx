import { notFound } from "next/navigation";
import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";
import { Product } from "@/models/Product";
import { ProductDetail } from "@/components/storefront/product-detail";

interface Props {
  params: Promise<{ storeSlug: string; productSlug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { storeSlug, productSlug } = await params;

  await connectDB();

  const store = await Store.findOne({ slug: storeSlug }).lean();
  if (!store) notFound();
  if (!store.isActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA]">
        <p className="text-xl text-muted-foreground">
          This store is currently unavailable
        </p>
      </div>
    );
  }

  const product = await Product.findOne({
    storeId: store._id,
    slug: productSlug,
  }).lean();

  if (!product) notFound();

  const productData = {
    _id: (product._id as string).toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    regularPrice: product.regularPrice,
    offerPrice: product.offerPrice,
    productCode: product.productCode,
    images: product.images,
    colors: product.colors,
    sizes: product.sizes,
    variantGroups: product.variantGroups,
    inStock: product.inStock,
    isActive: product.isActive,
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <ProductDetail product={productData} storeSlug={storeSlug} />
    </div>
  );
}
