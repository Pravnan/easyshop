"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/validations/schemas";
import { registerStore } from "@/actions/public/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

type RegisterInput = {
  ownerName: string;
  email: string;
  password: string;
  storeName: string;
  storeSlug: string;
  whatsappNumber: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    const result = await registerStore(data);
    if (!result.success) {
      toast.error(result.error || "Registration failed");
      setIsLoading(false);
      return;
    }
    toast.success("🎉 Your 15-day free trial has started!", {
      duration: 6000,
      position: "top-center",
    });
    // Auto-login
    const loginResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (loginResult?.ok) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Your Store</CardTitle>
        <p className="text-sm text-muted-foreground">Start your 15-day free trial — no credit card needed</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Your Name</Label>
            <Input id="ownerName" {...register("ownerName")} placeholder="John Silva" />
            {errors.ownerName && <p className="text-sm text-destructive">{errors.ownerName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} placeholder="At least 6 characters" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <hr />
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" {...register("storeName")} placeholder="My Awesome Store" />
            {errors.storeName && <p className="text-sm text-destructive">{errors.storeName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeSlug">Store URL</Label>
            <Input id="storeSlug" {...register("storeSlug")} placeholder="my-store" />
            <p className="text-xs text-muted-foreground">Your store will be at /store/my-store</p>
            {errors.storeSlug && <p className="text-sm text-destructive">{errors.storeSlug.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input id="whatsappNumber" {...register("whatsappNumber")} placeholder="94771234567" />
            {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-[#1565C0] hover:bg-[#0D47A1]" disabled={isLoading}>
            {isLoading ? "Creating..." : "Start Free Trial"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1565C0] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
