import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { PricingModal } from "@/components/PricingModal";

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
}

export function PremiumGate({ children, feature }: PremiumGateProps) {
  const { isPremium, isLoading } = useSubscription();
  const [showPricing, setShowPricing] = useState(false);

  if (isLoading) return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24" />
  );

  if (isPremium) return <>{children}</>;

  return (
    <>
      <div
        className="relative rounded-xl border border-dashed border-amber-300 dark:border-amber-700
                   bg-amber-50 dark:bg-amber-950/30 p-5 cursor-pointer group"
        onClick={() => setShowPricing(true)}
      >
        <div className="blur-sm pointer-events-none select-none opacity-40">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-full
                          px-4 py-2 shadow-md border border-amber-200 dark:border-amber-800">
            <Lock size={14} className="text-amber-600" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {feature ? `${feature} — Premium` : "Fonctionnalité Premium"}
            </span>
          </div>
          <button className="text-xs text-amber-600 dark:text-amber-400 underline
                             group-hover:text-amber-800 transition-colors">
            Débloquer pour €1,99/mois →
          </button>
        </div>
      </div>
      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />
    </>
  );
}
