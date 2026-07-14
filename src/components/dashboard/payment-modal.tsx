"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export function PaymentModal({ open, onClose }: PaymentModalProps) {
  const router = useRouter();

  async function handlePaid() {
    toast.success("Payment submitted for verification. Admin will activate your store shortly.");
    onClose();
    router.refresh();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <h2 className="mb-2 text-xl font-bold text-gray-900">Complete Your Payment</h2>
              <p className="mb-6 text-sm text-gray-500">
                Scan the QR code or use the bank details below to make your payment
              </p>

              {/* QR Code Placeholder */}
              <div className="mx-auto mb-6 flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-xl bg-[#1565C0]/10">
                    <svg className="h-12 w-12 text-[#1565C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400">QR Code Placeholder</p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="mb-6 rounded-xl bg-gray-50 p-4 text-left text-sm">
                <p className="mb-1 font-medium text-gray-700">Bank Transfer Details</p>
                <p className="text-gray-500">Bank: EasyShop Payments</p>
                <p className="text-gray-500">Account Name: EasyShop Ltd</p>
                <p className="text-gray-500">Account No: 1234-5678-9012</p>
                <p className="text-gray-500">Branch: Colombo 01</p>
              </div>

              <button
                onClick={handlePaid}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                I&apos;ve Made the Payment
              </button>
              <p className="mt-3 text-xs text-gray-400">
                After clicking, admin will verify your payment and activate your store
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
