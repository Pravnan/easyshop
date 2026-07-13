import Link from "next/link";

interface StoreData {
  _id: string;
  name: string;
  slug: string;
  logo?: { url: string; publicId: string };
  whatsappNumber: string;
}

export function StoreHeader({ store }: { store: StoreData }) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/store/${store.slug}`}
          className="flex items-center gap-3"
        >
          {store.logo?.url ? (
            <img
              src={store.logo.url}
              alt={store.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : null}
          <span className="text-xl font-bold text-[#1565C0]">
            {store.name}
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href={`/store/${store.slug}/cart`}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-[#1565C0]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="21" cy="21" r="1" />
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
            </svg>
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
