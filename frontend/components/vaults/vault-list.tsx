import { BadgeAlert, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const vaults = [
    {
        id: "1",
        collateral: "1.5 BTC",
        debt: "45,000 btcUSD",
        ratio: "214%",
        status: "Healthy",
        health: 85,
    },
    {
        id: "2",
        collateral: "0.8 BTC",
        debt: "35,000 btcUSD",
        ratio: "146%",
        status: "Warning",
        health: 45,
    },
    {
        id: "3",
        collateral: "2.1 BTC",
        debt: "12,000 btcUSD",
        ratio: "1120%",
        status: "Healthy",
        health: 98,
    },
]

export function VaultList() {
    return (
        <Card className="col-span-4 lg:col-span-3 bg-zinc-900/50 border-white/5">
            <CardHeader>
                <CardTitle>Your Vaults</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {vaults.map((vault) => (
                        <div
                            key={vault.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-[#f7931a]/10 flex items-center justify-center">
                                    <span className="font-bold text-[#f7931a]">#{vault.id}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-white">{vault.collateral}</p>
                                    <p className="text-sm text-zinc-400">Locked via Babylon</p>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-sm text-zinc-400">Debt</p>
                                <p className="font-medium text-white">{vault.debt}</p>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-sm text-zinc-400">Collateral Ratio</p>
                                <p className={cn(
                                    "font-medium",
                                    vault.health > 50 ? "text-green-500" : "text-yellow-500"
                                )}>
                                    {vault.ratio}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {vault.health > 50 ? (
                                    <div className="flex items-center gap-1 text-green-500 text-sm bg-green-500/10 px-2 py-1 rounded-full">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Healthy
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm bg-yellow-500/10 px-2 py-1 rounded-full">
                                        <AlertTriangle className="h-3 w-3" />
                                        Warning
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
