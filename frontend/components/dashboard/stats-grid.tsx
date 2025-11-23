import { ArrowUpRight, Bitcoin, DollarSign, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
    {
        title: "Total Value Locked",
        value: "$124.5M",
        change: "+12.5%",
        icon: Lock,
        description: "Across 1,234 Vaults",
    },
    {
        title: "BTC Price",
        value: "$64,230",
        change: "+2.4%",
        icon: Bitcoin,
        description: "Oracle Price Feed",
    },
    {
        title: "Total btcUSD Minted",
        value: "$45.2M",
        change: "+5.1%",
        icon: DollarSign,
        description: "Current Supply",
    },
    {
        title: "Global Collateral Ratio",
        value: "275%",
        change: "+1.2%",
        icon: ArrowUpRight,
        description: "Healthy System State",
    },
]

export function StatsGrid() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="bg-zinc-900/50 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-[#f7931a]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            <span className="text-green-500 font-medium">{stat.change}</span>{" "}
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
