"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  storeSettingsSchema,
  StoreSettingsInput,
} from "@/validations/schemas";
import {
  updateStoreSettings,
  updateLogo,
  updateBanner,
} from "@/actions/dashboard/settings";
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
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { compressImage } from "@/lib/client-image";

interface SettingsData {
  _id: string;
  name: string;
  slug: string;
  logo?: { url: string; publicId: string };
  banner?: { url: string; publicId: string };
  description?: string;
  whatsappNumber: string;
  phone?: string;
  email?: string;
  address?: string;
  deliveryInformation?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export function SettingsForm({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreSettingsInput>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      name: settings.name,
      slug: settings.slug,
      description: settings.description ?? "",
      whatsappNumber: settings.whatsappNumber,
      phone: settings.phone ?? "",
      email: settings.email ?? "",
      address: settings.address ?? "",
      deliveryInformation: settings.deliveryInformation ?? "",
      facebookUrl: settings.facebookUrl ?? "",
      instagramUrl: settings.instagramUrl ?? "",
    },
  });

  async function onSubmit(data: StoreSettingsInput) {
    setIsLoading(true);
    try {
      await updateStoreSettings(data);

      if (logoFile) {
        await updateLogo(logoFile);
      }
      if (bannerFile) {
        await updateBanner(bannerFile);
      }

      toast.success("Settings saved");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Store Slug</Label>
            <Input id="slug" {...register("slug")} />
            <p className="text-xs text-muted-foreground">
              URL: /store/{settings.slug}
            </p>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo & Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label>Store Logo</Label>
              {settings.logo?.url && !logoFile && (
                <div className="relative mb-2 mt-2 inline-block">
                  <img
                    src={settings.logo.url}
                    alt="Logo"
                    className="h-24 w-24 rounded-lg border object-cover"
                  />
                </div>
              )}
              {logoFile && (
                <div className="relative mb-2 mt-2 inline-block">
                  <img
                    src={URL.createObjectURL(logoFile)}
                    alt="New Logo"
                    className="h-24 w-24 rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setLogoFile(null)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[#1565C0] hover:underline">
                <Upload className="h-4 w-4" />
                Upload Logo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const compressed = await compressImage(file);
                      setLogoFile(compressed);
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <Label>Store Banner</Label>
              {settings.banner?.url && !bannerFile && (
                <div className="relative mb-2 mt-2 inline-block">
                  <img
                    src={settings.banner.url}
                    alt="Banner"
                    className="h-24 w-48 rounded-lg border object-cover"
                  />
                </div>
              )}
              {bannerFile && (
                <div className="relative mb-2 mt-2 inline-block">
                  <img
                    src={URL.createObjectURL(bannerFile)}
                    alt="New Banner"
                    className="h-24 w-48 rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setBannerFile(null)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[#1565C0] hover:underline">
                <Upload className="h-4 w-4" />
                Upload Banner
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const compressed = await compressImage(file, 1200);
                      setBannerFile(compressed);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              {...register("whatsappNumber")}
              placeholder="94771234567"
            />
            {errors.whatsappNumber && (
              <p className="text-sm text-destructive">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address (optional)</Label>
            <Textarea id="address" {...register("address")} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryInformation">
              Delivery Information (optional)
            </Label>
            <Textarea
              id="deliveryInformation"
              {...register("deliveryInformation")}
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">
                Facebook URL (optional)
              </Label>
              <Input
                id="facebookUrl"
                {...register("facebookUrl")}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">
                Instagram URL (optional)
              </Label>
              <Input
                id="instagramUrl"
                {...register("instagramUrl")}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-[#1565C0] hover:bg-[#0D47A1]"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
