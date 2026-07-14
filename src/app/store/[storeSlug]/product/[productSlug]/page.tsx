import { notFound } from "next/navigation";
import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { StoreHeader } from "@/components/storefront/store-header";
import { ProductDetail } from "@/components/storefront/product-detail";
import { StoreFooter } from "@/components/storefront/store-footer";
import { WhatsAppButton } from "@/components/storefront/whatsapp-button";

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500">This store is currently unavailable</p>
      </div>
    );
  }

  const product = await Product.findOne({ storeId: store._id, slug: productSlug }).lean();
  if (!product) notFound();

  const categories = await Category.find({ storeId: store._id, isActive: true }).sort({ name: 1 }).lean();
  const related = await Product.find({
    storeId: store._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(4)
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

  const relatedProducts = related.map((p) => ({
    _id: (p._id as string).toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    regularPrice: p.regularPrice,
    offerPrice: p.offerPrice,
    images: p.images,
    colors: p.colors,
    sizes: p.sizes,
    variantGroups: p.variantGroups,
    inStock: p.inStock,
    isActive: p.isActive,
  }));

  const categoryData = categories.map((c) => ({
    _id: (c._id as string).toString(),
    name: c.name,
    slug: c.slug,
  }));

  const storeForHeader = {
    name: storeData.name,
    slug: storeData.slug,
    logo: storeData.logo,
    categories: categoryData,
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <StoreHeader store={storeForHeader} />
      <ProductDetail product={productData} storeSlug={storeSlug} relatedProducts={relatedProducts} />
      <StoreFooter store={storeData} />
      <WhatsAppButton number={store.whatsappNumber} />
    </div>
  );
}
