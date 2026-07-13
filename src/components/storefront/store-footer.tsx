interface StoreData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  deliveryInformation?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export function StoreFooter({ store }: { store: StoreData }) {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 font-semibold text-[#1565C0]">{store.name}</h3>
            {store.address && (
              <p className="text-sm text-muted-foreground">{store.address}</p>
            )}
          </div>
          {store.deliveryInformation && (
            <div>
              <h3 className="mb-3 font-semibold">Delivery</h3>
              <p className="text-sm text-muted-foreground">
                {store.deliveryInformation}
              </p>
            </div>
          )}
          <div>
            <h3 className="mb-3 font-semibold">Contact</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              {store.phone && <p>Phone: {store.phone}</p>}
              {store.email && <p>Email: {store.email}</p>}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Follow Us</h3>
            <div className="space-y-1 text-sm">
              {store.facebookUrl && (
                <a
                  href={store.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#1565C0] hover:underline"
                >
                  Facebook
                </a>
              )}
              {store.instagramUrl && (
                <a
                  href={store.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#1565C0] hover:underline"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {store.name}. Powered by EasyShop.</p>
        </div>
      </div>
    </footer>
  );
}
