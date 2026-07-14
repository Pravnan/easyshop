"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CreditCard, X } from "lucide-react";
import { PaymentModal } from "./payment-modal";

interface TrialBannerProps {
  trialEndsAt?: string;
  paidAt?: string;
  isActive: boolean;
}

export function TrialBanner({ trialEndsAt, paidAt, isActive }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (dismissed || paidAt || !trialEndsAt) return null;

  const now = new Date();
  const end = new Date(trialEndsAt);
  const graceEnd = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  const remainingMs = end.getTime() - now.getTime();
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

  if (remainingDays < -1) return null; // trial + grace expired

  const isExpired = remainingDays <= 0;
  const isGrace = now > end && now <= graceEnd;

  let bgColor = "bg-blue-50 border-blue-200 text-blue-800";
  let iconColor = "text-blue-500";
  let message = "";

  if (isExpired) {
    bgColor = "bg-red-50 border-red-200 text-red-800";
    iconColor = "text-red-500";
    message = isGrace
      ? `⚠ Your trial ended. Grace period ends in ${Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60))} hours. Subscribe to keep your store active.`
      : "❌ Your trial has ended and your store is now disabled. Contact admin to reactivate.";
  } else if (remainingDays === 1) {
    message = `⚠ Your free trial ends tomorrow! Subscribe now to keep your store active.`;
  } else {
    message = `🎉 ${remainingDays} days left in your free trial. Subscribe when ready!`;
  }

  return (
    <>
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`${bgColor} border-b`}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Clock className={`h-5 w-5 ${iconColor}`} />
                <span>{message}</span>
              </div>
              <div className="flex items-center gap-2">
                {!isExpired && (
                  <button
                    onClick={() => setPaymentOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0D47A1] transition-colors"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Subscribe Now
                  </button>
                )}
                <button onClick={() => setDismissed(true)} className="p-1 hover:opacity-70">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </>
  );
}
