import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1565C0]">EasyShop</h1>
          <p className="mt-2 text-muted-foreground">Launch your online store in minutes</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
