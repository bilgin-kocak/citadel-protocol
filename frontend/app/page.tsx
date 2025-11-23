import { StatsGrid } from "@/components/dashboard/stats-grid";
import { VaultList } from "@/components/vaults/vault-list";
import { CreateVaultForm } from "@/components/vaults/create-vault-form";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-zinc-400">
          Monitor protocol statistics and manage your positions.
        </p>
      </div>

      <StatsGrid />

      <div className="grid gap-8 lg:grid-cols-4">
        <VaultList />
        <div className="lg:col-span-1">
          <CreateVaultForm />
        </div>
      </div>
    </div>
  );
}
