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

  const cssVars = `
    --primary: ${theme.colors.primary};
    --primary-dark: ${theme.colors["primary-dark"]};
    --primary-light: ${theme.colors["primary-light"]};
    --primary-foreground: ${theme.colors["primary-foreground"]};
    --secondary: ${theme.colors.secondary};
    --secondary-foreground: ${theme.colors["secondary-foreground"]};
    --accent: ${theme.colors["primary-light"]};
    --accent-foreground: ${theme.colors["primary-dark"]};
    --hero-from: ${theme.colors["hero-from"]};
    --hero-to: ${theme.colors["hero-to"]};
  `;

  return (
    <div className="storefront" style={{ "--primary": theme.colors.primary } as React.CSSProperties}>
      <style>{`.storefront { ${cssVars} }`}</style>
      {children}
    </div>
  );
}
