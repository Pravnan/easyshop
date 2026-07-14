"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <section className="py-20" style={{background: "linear-gradient(135deg, var(--hero-from), var(--primary))"}}>
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <ScrollReveal>
          <Mail className="mx-auto mb-4 h-10 w-10 text-white/60" />
          <h2 className="mb-3 text-3xl font-bold text-white">
            Join the Newsletter
          </h2>
          <p className="mb-8 text-white/70">
            Be the first to know about new arrivals, exclusive offers, and more.
          </p>
        </ScrollReveal>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 text-white"
          >
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="text-lg font-medium">Thanks for subscribing!</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12 rounded-xl border-white/20 bg-white/10 pl-4 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/30"
              />
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                className="h-12 rounded-xl bg-white px-6 text-[var(--primary-dark)] font-semibold hover:bg-white/90"
              >
                Subscribe
              </Button>
            </motion.div>
          </form>
        )}
      </div>
    </section>
  );
}
