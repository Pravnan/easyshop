import { ReactNode } from "react";
import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";
import { getTheme } from "@/lib/themes";

interface Props {
  children: ReactNode;
  params: Promise<{ storeSlug: string }>;
}

export default async function StoreLayout({ children, params }: Props) {
  const { storeSlug } = await params;
  await connectDB();
  const store = await Store.findOne({ slug: storeSlug }).lean();
  const theme = getTheme(store?.theme ?? "ocean-blue");

  const cssVars = Object.entries(theme.colors)
    .map(([key, val]) => `--theme-${key}: ${val};`)
    .join("");

  return (
    <div
      style={
        { "--theme-primary": theme.colors.primary } as React.CSSProperties
      }
    >
      <style>{`:root { ${cssVars} }`}</style>
      {children}
    </div>
  );
}
