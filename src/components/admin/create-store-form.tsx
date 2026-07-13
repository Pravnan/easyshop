"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStoreSchema, CreateStoreInput } from "@/validations/schemas";
import { createStore } from "@/actions/admin/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export function CreateStoreForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoreInput>({
    resolver: zodResolver(createStoreSchema),
  });

  async function onSubmit(data: CreateStoreInput) {
    setIsLoading(true);
    try {
      await createStore(data);
      toast.success("Store and shop owner created successfully");
      router.push("/admin/stores");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create store");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Owner Information</h3>
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-sm text-destructive">{errors.ownerName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Temporary Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Store Information</h3>
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input id="storeName" {...register("storeName")} />
          {errors.storeName && (
            <p className="text-sm text-destructive">{errors.storeName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeSlug">Store Slug</Label>
          <Input id="storeSlug" placeholder="my-store" {...register("storeSlug")} />
          <p className="text-xs text-muted-foreground">
            URL: /store/my-store
          </p>
          {errors.storeSlug && (
            <p className="text-sm text-destructive">{errors.storeSlug.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input id="whatsappNumber" placeholder="94771234567" {...register("whatsappNumber")} />
          {errors.whatsappNumber && (
            <p className="text-sm text-destructive">
              {errors.whatsappNumber.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#1565C0] hover:bg-[#0D47A1]"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Store"}
      </Button>
    </form>
  );
}
