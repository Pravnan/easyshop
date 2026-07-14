"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { themes, getTheme } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThemeSelectorProps {
  currentTheme: string;
  storeId: string;
}

export function ThemeSelector({ currentTheme, storeId }: ThemeSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentTheme);
  const [saving, setSaving] = useState(false);

  async function handleSave(themeName: string) {
    setSaving(true);
    setSelected(themeName);
    try {
      const res = await fetch("/api/store/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeName, storeId }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Theme updated");
      router.refresh();
    } catch {
      toast.error("Failed to update theme");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {Object.values(themes).map((theme) => {
        const t = getTheme(theme.name);
        const isSelected = selected === theme.name;
        return (
          <motion.button
            key={theme.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSave(theme.name)}
            disabled={saving}
            className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
              isSelected ? "border-[#1565C0] ring-2 ring-[#1565C0]/20 shadow-lg" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {isSelected && (
              <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#1565C0] text-white">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className={`mb-4 h-24 w-full rounded-xl ${theme.preview}`} />
            <h3 className="font-semibold text-gray-900">{theme.label}</h3>
            <div className="mt-2 flex gap-1.5">
              <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: t.colors.primary }} />
              <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: t.colors["primary-dark"] }} />
              <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: t.colors.accent }} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
