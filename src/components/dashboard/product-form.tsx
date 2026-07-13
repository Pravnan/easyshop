"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/validations/schemas";
import { createProduct, updateProduct } from "@/actions/dashboard/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { compressImage } from "@/lib/client-image";

interface CategoryItem {
  _id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryItem[];
  product?: {
    _id: string;
    categoryId: string;
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
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [isLoading, setIsLoading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.images.map((i) => i.url) ?? []
  );
  const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? "",
      regularPrice: product?.regularPrice ?? 0,
      offerPrice: product?.offerPrice ?? ("" as unknown as number),
      productCode: product?.productCode ?? "",
      colors: product?.colors ?? [],
      sizes: product?.sizes ?? [],
      variantGroups: product?.variantGroups ?? [],
      inStock: product?.inStock ?? true,
      isActive: product?.isActive ?? true,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctrl = control as any;

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control: ctrl,
    name: "colors",
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control: ctrl,
    name: "sizes",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: ctrl,
    name: "variantGroups",
  });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const total = imagePreviews.length + files.length;
    if (total > 2) {
      toast.error("Maximum 2 images allowed");
      return;
    }
    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Images must be JPEG, PNG, or WebP");
        return;
      }
    }
    const compressed = await Promise.all(files.map((f) => compressImage(f, 800)));
    setNewImages((prev) => [...prev, ...compressed]);
    setImagePreviews((prev) => [
      ...prev,
      ...compressed.map((f) => URL.createObjectURL(f)),
    ]);
  }, [imagePreviews.length]);

  const removeImage = useCallback(
    (index: number) => {
      if (product?.images[index]) {
        setRemovedPublicIds((prev) => [
          ...prev,
          product.images[index].publicId,
        ]);
      }
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setNewImages((prev) =>
        prev.filter((_, i) => i !== index - (product?.images.length ?? 0))
      );
    },
    [product]
  );

  async function onSubmit(data: ProductInput) {
    setIsLoading(true);
    try {
      if (isEditing && product) {
        await updateProduct(
          product._id,
          data,
          newImages,
          product.images.filter(
            (_, i) => !removedPublicIds.includes(product.images[i].publicId)
          ),
          removedPublicIds
        );
        toast.success("Product updated");
      } else {
        await createProduct(data, newImages);
        toast.success("Product created");
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} placeholder="product-name" />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("categoryId")}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={5}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="regularPrice">Regular Price (Rs.)</Label>
              <Input
                id="regularPrice"
                type="number"
                min="0"
                step="0.01"
                {...register("regularPrice")}
              />
              {errors.regularPrice && (
                <p className="text-sm text-destructive">
                  {errors.regularPrice.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerPrice">
                Offer Price (optional, Rs.)
              </Label>
              <Input
                id="offerPrice"
                type="number"
                min="0"
                step="0.01"
                {...register("offerPrice")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productCode">Product Code (optional)</Label>
            <Input id="productCode" {...register("productCode")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images (max 2)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((preview, i) => (
              <div key={i} className="relative">
                <img
                  src={preview}
                  alt={`Product ${i + 1}`}
                  className="h-32 w-32 rounded-lg border object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 2 && (
              <label className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-[#1565C0]">
                <Upload className="h-6 w-6" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {colorFields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...register(`colors.${i}`)}
                  className="w-32"
                  placeholder="Blue"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeColor(i)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => appendColor("" as any)}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Color
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sizeFields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...register(`sizes.${i}`)}
                  className="w-24"
                  placeholder="M"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSize(i)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => appendSize("" as any)}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Size
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(variantFields as Array<{ id: string; name: string; options: string[] }>).map((group, gi) => (
            <div key={group.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <Input
                  {...register(`variantGroups.${gi}.name`)}
                  className="w-48"
                  placeholder="e.g. Material"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(gi)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.options.map((_, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <Input
                      {...register(`variantGroups.${gi}.options.${oi}`)}
                      className="w-32"
                      placeholder="Option"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const current = control._formValues.variantGroups[gi]?.options ?? [];
                        const newOptions = current.filter((_: string, idx: number) => idx !== oi);
                        control._formValues.variantGroups[gi].options = newOptions;
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = control._formValues.variantGroups[gi]?.options ?? [];
                    control._formValues.variantGroups[gi].options = [...current, ""];
                  }}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Option
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendVariant({ name: "", options: [""] })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Variant Group
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("inStock")}
                className="h-4 w-4 rounded border-gray-300 text-[#1565C0]"
              />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border-gray-300 text-[#1565C0]"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-[#1565C0] hover:bg-[#0D47A1]"
        disabled={isLoading}
      >
        {isLoading
          ? "Saving..."
          : isEditing
          ? "Update Product"
          : "Create Product"}
      </Button>
    </form>
  );
}
