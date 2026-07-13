import Link from "next/link";

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  regularPrice: number;
  offerPrice?: number;
  images: { url: string; publicId: string }[];
  inStock: boolean;
}

interface ProductGridProps {
  products: ProductData[];
  storeSlug: string;
}

export function ProductGrid({ products, storeSlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/store/${storeSlug}/product/${product.slug}`}
          className="group rounded-xl border bg-white p-4 transition-shadow hover:shadow-lg"
        >
          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-[#F5F7FA]">
            {product.images[0] ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <h3 className="font-medium text-[#1F2937]">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            {product.offerPrice ? (
              <>
                <span className="text-lg font-bold text-[#1565C0]">
                  Rs. {product.offerPrice.toLocaleString("en-LK")}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  Rs. {product.regularPrice.toLocaleString("en-LK")}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[#1565C0]">
                Rs. {product.regularPrice.toLocaleString("en-LK")}
              </span>
            )}
          </div>
          {!product.inStock && (
            <p className="mt-1 text-sm text-destructive">Out of stock</p>
          )}
        </Link>
      ))}
    </div>
  );
}
