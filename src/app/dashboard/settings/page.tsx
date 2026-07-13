import { requireShopOwner } from "@/lib/permissions/authorize";
import { getStoreSettings } from "@/actions/dashboard/settings";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  await requireShopOwner();
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">
          Configure your storefront
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
