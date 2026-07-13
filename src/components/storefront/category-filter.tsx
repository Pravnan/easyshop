import Link from "next/link";

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: CategoryData[];
  activeCategory?: string;
  storeSlug: string;
}

export function CategoryFilter({
  categories,
  activeCategory,
  storeSlug,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href={`/store/${storeSlug}`}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-[#1565C0] text-white"
            : "bg-white text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/store/${storeSlug}?category=${category._id}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === category._id
              ? "bg-[#1565C0] text-white"
              : "bg-white text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
