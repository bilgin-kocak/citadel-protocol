"use client"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function CreateVaultForm() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
    }

    return (
        <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader>
                <CardTitle>Open New Vault</CardTitle>
                <CardDescription>
                    Lock BTC to mint btcUSD stablecoin
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">
                            BTC Amount to Lock
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#f7931a]/50"
                            />
                            <span className="absolute right-3 top-3 text-sm font-medium text-zinc-500">
                                BTC
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">
                            Generate btcUSD
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#f7931a]/50"
                            />
                            <span className="absolute right-3 top-3 text-sm font-medium text-zinc-500">
                                btcUSD
                            </span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-500">Liquidation Price</span>
                            <span className="text-white">$45,230.00</span>
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-zinc-500">Collateral Ratio</span>
                            <span className="text-[#f7931a]">165%</span>
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-[#f7931a] hover:bg-[#f7931a]/90 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Open Vault
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            </CardContent>
        </Card>
    )
}
