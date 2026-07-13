"use client";

import { useRouter } from "next/navigation";
import { deleteProduct, toggleProductStatus } from "@/actions/dashboard/products";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProductActionsProps {
  productId: string;
  isActive: boolean;
}

export function ProductActions({ productId, isActive }: ProductActionsProps) {
  const router = useRouter();

  async function handleToggle() {
    try {
      await toggleProductStatus(productId);
      toast.success(isActive ? "Product deactivated" : "Product activated");
      router.refresh();
    } catch {
      toast.error("Failed to toggle product");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await deleteProduct(productId);
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={`/dashboard/products/${productId}/edit`}>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleToggle}>
        {isActive ? (
          <ToggleRight className="h-4 w-4 text-green-600" />
        ) : (
          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
