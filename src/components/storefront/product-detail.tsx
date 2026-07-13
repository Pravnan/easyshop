"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  regularPrice: number;
  offerPrice?: number;
  productCode?: string;
  images: { url: string; publicId: string }[];
  colors: string[];
  sizes: string[];
  variantGroups: { name: string; options: string[] }[];
  inStock: boolean;
  isActive: boolean;
}

export function ProductDetail({ product, storeSlug }: { product: ProductData; storeSlug: string }) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const currentPrice = product.offerPrice ?? product.regularPrice;

  function handleAddToCart() {
    if (!product.inStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (items.length > 0 && items[0].productId !== product._id) {
      const sameStore = items.some(
        (item) => item.productId === product._id
      );
      if (!sameStore) {
        if (!window.confirm("Your cart contains items from another product. Clear cart and add this item?")) {
          return;
        }
      }
    }

    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "",
      regularPrice: product.regularPrice,
      offerPrice: product.offerPrice,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
      selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
      quantity,
    });

    toast.success("Added to cart");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-[#F5F7FA]">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
                    selectedImage === i ? "border-[#1565C0]" : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.productCode && (
            <p className="text-sm text-muted-foreground">Code: {product.productCode}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2">
            {product.offerPrice ? (
              <>
                <span className="text-3xl font-bold text-[#1565C0]">
                  Rs. {product.offerPrice.toLocaleString("en-LK")}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  Rs. {product.regularPrice.toLocaleString("en-LK")}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[#1565C0]">
                Rs. {product.regularPrice.toLocaleString("en-LK")}
              </span>
            )}
          </div>

          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Colour</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                      selectedColor === color
                        ? "border-[#1565C0] bg-[#EAF4FF] text-[#1565C0]"
                        : "bg-white hover:bg-[#F5F7FA]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                      selectedSize === size
                        ? "border-[#1565C0] bg-[#EAF4FF] text-[#1565C0]"
                        : "bg-white hover:bg-[#F5F7FA]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variantGroups.map((group) => (
            <div key={group.name} className="mt-4">
              <p className="mb-2 text-sm font-medium">{group.name}</p>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [group.name]: option,
                      }))
                    }
                    className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                      selectedVariants[group.name] === option
                        ? "border-[#1565C0] bg-[#EAF4FF] text-[#1565C0]"
                        : "bg-white hover:bg-[#F5F7FA]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-[#F5F7FA]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-[#F5F7FA]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              Total: Rs. {(currentPrice * quantity).toLocaleString("en-LK")}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-[#1565C0] hover:bg-[#0D47A1]"
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
