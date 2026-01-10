import Link from 'next/link';
import { CreditCard, History, Home, LogOut, Wallet } from 'lucide-react';

export default function WalletLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-800 dark:text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            My Wallet
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Secure Payments</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/wallet" icon={<Home size={20} />} label="Dashboard" />
                    <NavItem href="/wallet/recharge" icon={<CreditCard size={20} />} label="Recharge" />
                    <NavItem href="/wallet/bills" icon={<CreditCard size={20} />} label="Pay Bills" />
                    <NavItem href="/wallet/history" icon={<History size={20} />} label="Transactions" />
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <a href="http://localhost:3000" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all">
                        <LogOut size={20} />
                        Back to Home
                    </a>
                </div>
            </aside>

            {/* Mobile Header (Visible on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-indigo-600" />
                    <span className="font-bold">My Wallet</span>
                </div>
                {/* Simple mobile menu could go here, for now relying on bottom tabs or similar if built */}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all group"
        >
            <span className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {icon}
            </span>
            {label}
        </Link>
    );
}
