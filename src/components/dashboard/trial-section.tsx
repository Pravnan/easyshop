import { getStoreTrialInfo } from "@/actions/dashboard/trial";
import { TrialBanner } from "@/components/dashboard/trial-banner";

interface TrialSectionProps {
  storeId: string;
}

export async function TrialSection({ storeId }: TrialSectionProps) {
  const info = await getStoreTrialInfo(storeId);
  if (!info || info.paidAt) return null;

  return (
    <div className="mb-6">
      <TrialBanner
        trialEndsAt={info.trialEndsAt}
        paidAt={info.paidAt}
        isActive={info.isActive}
      />
    </div>
  );
}
