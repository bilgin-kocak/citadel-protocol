import Link from "next/link"
import { Shield, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Shield className="h-8 w-8 text-[#f7931a]" />
                    <span className="text-xl font-bold tracking-tight text-white">
                        Citadel <span className="text-[#f7931a]">Protocol</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/vaults"
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                    >
                        My Vaults
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                    >
                        Analytics
                    </Link>
                </div>

                <button className="flex items-center gap-2 rounded-full bg-[#f7931a] px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95">
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                </button>
            </div>
        </nav>
    )
}
