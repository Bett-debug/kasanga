import React from 'react';
import { Menu, Plus } from 'lucide-react';

interface TopNavProps {
  walletBalance: number;
  customerId: string;
  onOpenMenu: () => void;
  onOpenDeposit: () => void;
  onSignOut: () => void;
  onGoHome: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  walletBalance,
  customerId,
  onOpenMenu,
  onOpenDeposit,
  onSignOut,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#16202c] bg-[#070b10]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Menu trigger + Brand wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#223042] bg-[#101925] px-3.5 text-sm font-semibold text-[#e6edf5] transition-colors hover:border-[#324660] hover:bg-[#162232] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Open CAMPUS menu"
          >
            <Menu className="h-4 w-4 text-[#c7d2df]" aria-hidden="true" />
            <span>Menu</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="text-xl font-extrabold tracking-tight text-[#f3f7fb] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] rounded cursor-pointer"
          >
            CAMPUS<span className="text-[#7ee2b8]">.</span>
          </button>
        </div>

        {/* Right: Customer tag + Wallet button + Sign out */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <span className="hidden md:inline-block font-mono text-[11px] font-medium tracking-wider text-[#8293a7] uppercase whitespace-nowrap shrink-0">
            CUSTOMER &bull; {customerId}
          </span>

          <button
            type="button"
            onClick={onOpenDeposit}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#245648] bg-[#0e1f1c] px-3.5 text-sm font-semibold text-[#eef5f2] tabular-nums transition-colors hover:border-[#7ee2b8]/70 hover:bg-[#132924] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Wallet ${walletBalance.toFixed(2)}</span>
            <Plus className="h-3.5 w-3.5 text-[#9bc4b5]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#4c242d] bg-[#12141e] px-3.5 text-sm font-semibold text-[#e6edf5] transition-colors hover:border-[#7a3745] hover:bg-[#1b1720] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a9b0] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};
