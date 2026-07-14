"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Clock, ShieldCheck, Sparkles } from "lucide-react";

const announcements = [
  { icon: Truck, text: "Free Shipping on orders over Rs. 5,000" },
  { icon: Clock, text: "Limited Time Offers — Up to 40% Off" },
  { icon: ShieldCheck, text: "Secure Checkout with SSL Encryption" },
  { icon: Sparkles, text: "New Collection — Shop the Latest Trends" },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { icon: Icon, text } = announcements[index];

  return (
    <div className="flex h-10 items-center justify-center text-white text-xs sm:text-sm font-medium" style={{backgroundColor: "var(--primary-dark)"}}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Icon className="h-4 w-4" />
          <span>{text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
