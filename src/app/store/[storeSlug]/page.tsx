import { notFound } from "next/navigation";
import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { StoreHeader } from "@/components/storefront/store-header";
import { ProductGrid } from "@/components/storefront/product-grid";
import { CategoryFilter } from "@/components/storefront/category-filter";
import { WhatsAppButton } from "@/components/storefront/whatsapp-button";
import { StoreFooter } from "@/components/storefront/store-footer";

interface Props {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function StorePage({ params, searchParams }: Props) {
  const { storeSlug } = await params;
  const { category: categoryFilter } = await searchParams;

  await connectDB();

  const store = await Store.findOne({ slug: storeSlug }).lean();
  if (!store) notFound();
  if (!store.isActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1565C0]">
            This store is currently unavailable
          </h1>
          <p className="mt-2 text-muted-foreground">
            Please check back later.
          </p>
        </div>
      </div>
    );
  }

  const categories = await Category.find({
    storeId: store._id,
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();

  const productFilter: Record<string, unknown> = {
    storeId: store._id,
    isActive: true,
  };
  if (categoryFilter) {
    productFilter.categoryId = categoryFilter;
  }

  const products = await Product.find(productFilter)
    .sort({ createdAt: -1 })
    .lean();

  const storeData = {
    _id: (store._id as string).toString(),
    name: store.name,
    slug: store.slug,
    logo: store.logo,
    banner: store.banner,
    description: store.description,
    whatsappNumber: store.whatsappNumber,
    phone: store.phone,
    email: store.email,
    address: store.address,
    deliveryInformation: store.deliveryInformation,
    facebookUrl: store.facebookUrl,
    instagramUrl: store.instagramUrl,
  };

  const categoryData = categories.map((c) => ({
    _id: (c._id as string).toString(),
    name: c.name,
    slug: c.slug,
  }));

  const productData = products.map((p) => ({
    _id: (p._id as string).toString(),
    name: p.name,
    slug: p.slug,
    regularPrice: p.regularPrice,
    offerPrice: p.offerPrice,
    images: p.images,
    inStock: p.inStock,
    categoryId: (p.categoryId as string).toString(),
  }));

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <StoreHeader store={storeData} />
      {store.banner?.url && (
        <div className="h-48 w-full overflow-hidden sm:h-64">
          <img
            src={store.banner.url}
            alt={`${store.name} banner`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {store.description && (
          <p className="mb-8 text-center text-lg text-muted-foreground">
            {store.description}
          </p>
        )}
        <CategoryFilter
          categories={categoryData}
          activeCategory={categoryFilter}
          storeSlug={storeSlug}
        />
        <ProductGrid products={productData} storeSlug={storeSlug} />
      </main>
      <StoreFooter store={storeData} />
      <WhatsAppButton number={store.whatsappNumber} />
    </div>
  );
}
