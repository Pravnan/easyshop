export interface Theme {
  name: string;
  label: string;
  colors: {
    primary: string;
    "primary-dark": string;
    "primary-light": string;
    "primary-foreground": string;
    secondary: string;
    "secondary-foreground": string;
    accent: string;
    "accent-foreground": string;
    hero: string;
    "hero-from": string;
    "hero-to": string;
  };
  preview: string;
}

export const themes: Record<string, Theme> = {
  "ocean-blue": {
    name: "ocean-blue",
    label: "Ocean Blue",
    colors: {
      primary: "#1565C0",
      "primary-dark": "#0D47A1",
      "primary-light": "#EAF4FF",
      "primary-foreground": "#FFFFFF",
      secondary: "#F5F7FA",
      "secondary-foreground": "#1F2937",
      accent: "#EAF4FF",
      "accent-foreground": "#0D47A1",
      hero: "from-[#0D47A1] via-[#1565C0] to-[#1E88E5]",
      "hero-from": "#0D47A1",
      "hero-to": "#1E88E5",
    },
    preview: "bg-[#1565C0]",
  },
  "midnight-noir": {
    name: "midnight-noir",
    label: "Midnight Noir",
    colors: {
      primary: "#1A1A2E",
      "primary-dark": "#0F0F1A",
      "primary-light": "#EEEFF5",
      "primary-foreground": "#FFFFFF",
      secondary: "#F8F8FC",
      "secondary-foreground": "#1A1A2E",
      accent: "#E94560",
      "accent-foreground": "#FFFFFF",
      hero: "from-[#0F0F1A] via-[#1A1A2E] to-[#16213E]",
      "hero-from": "#0F0F1A",
      "hero-to": "#16213E",
    },
    preview: "bg-[#1A1A2E]",
  },
  "forest-moss": {
    name: "forest-moss",
    label: "Forest Moss",
    colors: {
      primary: "#2E7D32",
      "primary-dark": "#1B5E20",
      "primary-light": "#E8F5E9",
      "primary-foreground": "#FFFFFF",
      secondary: "#F1F8E9",
      "secondary-foreground": "#1F2937",
      accent: "#E8F5E9",
      "accent-foreground": "#1B5E20",
      hero: "from-[#1B5E20] via-[#2E7D32] to-[#43A047]",
      "hero-from": "#1B5E20",
      "hero-to": "#43A047",
    },
    preview: "bg-[#2E7D32]",
  },
  "rose-blush": {
    name: "rose-blush",
    label: "Rose Blush",
    colors: {
      primary: "#C62828",
      "primary-dark": "#8E0000",
      "primary-light": "#FFEBEE",
      "primary-foreground": "#FFFFFF",
      secondary: "#FFF5F5",
      "secondary-foreground": "#1F2937",
      accent: "#FFEBEE",
      "accent-foreground": "#8E0000",
      hero: "from-[#8E0000] via-[#C62828] to-[#E53935]",
      "hero-from": "#8E0000",
      "hero-to": "#E53935",
    },
    preview: "bg-[#C62828]",
  },
};

export function getTheme(name: string): Theme {
  return themes[name] || themes["ocean-blue"];
}
