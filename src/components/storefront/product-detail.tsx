"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, Heart, ChevronDown, Truck, RotateCcw, Shield, Star } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { buttonHover } from "@/lib/animations";

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
}

interface ProductDetailProps {
  product: ProductData;
  storeSlug: string;
  relatedProducts?: ProductData[];
}

export function ProductDetail({ product, storeSlug, relatedProducts }: ProductDetailProps) {
  const { addItem, items } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [openAccordion, setOpenAccordion] = useState<string>("description");
  const imageRef = useRef<HTMLDivElement>(null);

  const currentPrice = product.offerPrice ?? product.regularPrice;
  const discount = product.offerPrice ? Math.round((1 - product.offerPrice / product.regularPrice) * 100) : 0;

  function handleMouseMove(e: React.MouseEvent) {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }

  function handleAddToCart() {
    if (!product.inStock) { toast.error("This product is out of stock"); return; }
    if (items.length > 0 && items[0].productId !== product._id) {
      if (!window.confirm("Your cart contains items from another product. Clear cart and add this item?")) return;
    }
    addItem({
      productId: product._id, slug: product.slug, name: product.name,
      image: product.images[0]?.url ?? "", regularPrice: product.regularPrice,
      offerPrice: product.offerPrice,
      selectedColor: selectedColor || undefined, selectedSize: selectedSize || undefined,
      selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
      quantity,
    });
    toast.success("Added to cart");
  }

  const accordionItems = [
    { id: "description", label: "Description", content: product.description },
    { id: "shipping", label: "Shipping & Delivery", content: "Free shipping on orders over Rs. 5,000. Standard delivery takes 3-5 business days. Express delivery available at checkout." },
    { id: "returns", label: "Returns & Exchanges", content: "Free returns within 14 days of delivery. Items must be unworn with tags attached. Refunds processed within 5-7 business days." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <a href={`/store/${storeSlug}`} className="hover:text-[#1565C0] transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left — Image Gallery */}
          <div>
            <motion.div
              ref={imageRef}
              className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-crosshair"
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={product.images[selectedImage]?.url ?? "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  style={
                    zoomed
                      ? { transform: "scale(2)", transformOrigin: `${mousePos.x}% ${mousePos.y}%`, transition: "transform 0.1s" }
                      : { transform: "scale(1)", transition: "transform 0.3s" }
                  }
                />
              </AnimatePresence>
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  -{discount}%
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="rounded-full bg-white px-6 py-2 text-sm font-bold text-gray-900 shadow-xl">Out of Stock</span>
                </div>
              )}
            </motion.div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === i ? "border-[#1565C0] ring-2 ring-[#1565C0]/20 shadow-md" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col">
            {product.productCode && (
              <p className="text-sm text-gray-400 font-mono">SKU: {product.productCode}</p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-3xl font-bold tracking-tight text-gray-900"
            >
              {product.name}
            </motion.h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
              ))}
              <span className="ml-2 text-sm text-gray-500">(12 reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-4xl font-bold text-[#1565C0]">
                Rs. {currentPrice.toLocaleString("en-LK")}
              </span>
              {product.offerPrice && (
                <span className="text-xl text-gray-400 line-through">
                  Rs. {product.regularPrice.toLocaleString("en-LK")}
                </span>
              )}
              {product.inStock && (
                <span className="ml-auto rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                  In Stock
                </span>
              )}
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Colour <span className="text-gray-400 font-normal">{selectedColor && `— ${selectedColor}`}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-xl border-2 px-5 py-2.5 text-sm font-medium transition-all ${
                        selectedColor === color
                          ? "border-[#1565C0] bg-[#EAF4FF] text-[#1565C0] shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {color}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Size <span className="text-gray-400 font-normal">{selectedSize && `— ${selectedSize}`}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border-2 px-5 py-2.5 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-[#1565C0] bg-[#EAF4FF] text-[#1565C0] shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Variants */}
            {product.variantGroups.map((group) => (
              <div key={group.name} className="mt-5">
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  {group.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [group.name]: option }))}
                      className={`rounded-xl border-2 px-5 py-2.5 text-sm font-medium transition-all ${
                        selectedVariants[group.name] === option
                          ? "border-[#1565C0] bg-[#EAF4FF] text-[#1565C0] shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-gray-900">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border-2 border-gray-200">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors rounded-l-xl"
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <span className="w-14 text-center text-base font-medium">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors rounded-r-xl"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
                <span className="text-sm text-gray-500">
                  Total: <span className="font-bold text-gray-900">Rs. {(currentPrice * quantity).toLocaleString("en-LK")}</span>
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-8 flex gap-3">
              <motion.button
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#1565C0] py-4 text-base font-semibold text-white shadow-lg shadow-[#1565C0]/20 hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.inStock ? "Add to Cart" : "Sold Out"}
              </motion.button>
              <motion.button
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors"
                onClick={() => toast.success("Added to wishlist")}
              >
                <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-4 border-t pt-6">
              {[
                { icon: Truck, label: "Free Shipping", sub: "On orders over Rs. 5,000" },
                { icon: RotateCcw, label: "Easy Returns", sub: "14-day return policy" },
                { icon: Shield, label: "Secure Checkout", sub: "SSL encrypted payment" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FF]">
                    <item.icon className="h-4 w-4 text-[#1565C0]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-xs">{item.label}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="mt-8 space-y-2 border-t pt-6">
              {accordionItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? "" : item.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openAccordion === item.id ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600">{item.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">You May Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((rp) => (
                <a key={rp._id} href={`/store/${storeSlug}/product/${rp.slug}`} className="group">
                  <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-gray-100">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                      src={rp.images[0]?.url ?? "/placeholder.svg"}
                      alt={rp.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-[#1565C0] transition-colors">{rp.name}</h3>
                  <p className="text-lg font-bold text-[#1565C0]">
                    Rs. {(rp.offerPrice ?? rp.regularPrice).toLocaleString("en-LK")}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
