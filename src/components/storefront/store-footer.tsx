"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ChevronRight, ExternalLink } from "lucide-react";

interface StoreData {
  name: string;
  slug: string;
  phone?: string;
  email?: string;
  address?: string;
  deliveryInformation?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export function StoreFooter({ store }: { store: StoreData }) {
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: `/store/${store.slug}` },
        { label: "New Arrivals", href: `/store/${store.slug}` },
        { label: "Best Sellers", href: `/store/${store.slug}` },
        { label: "Sale", href: `/store/${store.slug}` },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Shipping", href: "#" },
        { label: "Returns", href: "#" },
      ],
    },
    {
      title: "Policies",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Refund Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={`/store/${store.slug}`}>
              <h3 className="mb-4 text-xl font-bold text-[var(--primary-dark)]">{store.name}</h3>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-500">
              {store.deliveryInformation || "Premium products curated for quality and style."}
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              {store.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>{store.address}</span>
                </div>
              )}
              {store.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>{store.phone}</span>
                </div>
              )}
              {store.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>{store.email}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              {store.facebookUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={store.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[var(--primary)] hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.35 3.24 9.35 5.47v1.99H6.38v3.95h2.97v11.97h4.54V11.43h3.06l.58-3.97z"/></svg>
                </motion.a>
              )}
              {store.instagramUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={store.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[var(--primary)] hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </motion.a>
              )}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--primary)] transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {store.name}. All rights reserved. Powered by EasyShop.</p>
        </div>
      </div>
    </footer>
  );
}
