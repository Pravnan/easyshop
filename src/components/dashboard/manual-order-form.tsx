"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { manualOrderSchema, ManualOrderInput } from "@/validations/schemas";
import { createManualOrder } from "@/actions/dashboard/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

export function ManualOrderForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ManualOrderInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(manualOrderSchema) as any,
    defaultValues: {
      status: "NEW",
      quantity: 1,
    },
  });

  async function onSubmit(data: ManualOrderInput) {
    setIsLoading(true);
    try {
      const result = await createManualOrder(data);
      toast.success(`Order ${result.orderId} created`);
      router.push("/dashboard/orders");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create order");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="externalOrderId">External Order ID (optional)</Label>
        <Input id="externalOrderId" {...register("externalOrderId")} placeholder="Leave blank for auto-generated ID" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input id="customerName" {...register("customerName")} />
          {errors.customerName && (
            <p className="text-sm text-destructive">{errors.customerName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone</Label>
          <Input id="customerPhone" {...register("customerPhone")} />
          {errors.customerPhone && (
            <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerAddress">Address</Label>
        <Input id="customerAddress" {...register("customerAddress")} />
        {errors.customerAddress && (
          <p className="text-sm text-destructive">{errors.customerAddress.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerCity">City (optional)</Label>
          <Input id="customerCity" {...register("customerCity")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email (optional)</Label>
          <Input id="customerEmail" type="email" {...register("customerEmail")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productDescription">Product Description</Label>
        <Textarea id="productDescription" {...register("productDescription")} />
        {errors.productDescription && (
          <p className="text-sm text-destructive">{errors.productDescription.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" min="1" {...register("quantity")} />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input id="totalAmount" type="number" min="0" step="0.01" {...register("totalAmount")} />
          {errors.totalAmount && (
            <p className="text-sm text-destructive">{errors.totalAmount.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("status")}
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerNote">Customer Note (optional)</Label>
        <Textarea id="customerNote" {...register("customerNote")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="internalNote">Internal Note (optional)</Label>
        <Textarea id="internalNote" {...register("internalNote")} />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#1565C0] hover:bg-[#0D47A1]"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Order"}
      </Button>
    </form>
  );
}
