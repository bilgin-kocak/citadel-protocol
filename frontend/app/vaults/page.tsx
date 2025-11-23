import { VaultList } from "@/components/vaults/vault-list";
import { CreateVaultForm } from "@/components/vaults/create-vault-form";

export default function VaultsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">My Vaults</h1>
                <p className="text-zinc-400">
                    Manage your Bitcoin collateral and btcUSD debt positions.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <VaultList />
                </div>
                <div className="lg:col-span-1">
                    <CreateVaultForm />
                </div>
            </div>
        </div>
    );
}
