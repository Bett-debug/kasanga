import React, { useEffect } from 'react';
import {
  LayoutGrid,
  ReceiptText,
  Plus,
  Heart,
  Sparkles,
  Gift,
  Link2,
  Send,
  LogOut,
  X,
} from 'lucide-react';
import { NavSection } from '../types/campus';

interface NavigationDrawerProps {
  isOpen: boolean;
  activeSection: NavSection;
  unreadNotifications: number;
  wishlistCount: number;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  onOpenDeposit: () => void;
  onJoinTelegram: () => void;
  onSignOut: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  activeSection,
  unreadNotifications,
  wishlistCount,
  onClose,
  onNavigate,
  onOpenDeposit,
  onJoinTelegram,
  onSignOut,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems: Array<{
    id: NavSection;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }> = [
    {
      id: 'available-items',
      label: 'Available items',
      icon: <LayoutGrid className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: 'my-orders',
      label: 'My orders',
      icon: <ReceiptText className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: <Plus className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: <Heart className="h-4 w-4" aria-hidden="true" />,
      count: wishlistCount > 0 ? wishlistCount : undefined,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
      count: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      id: 'promo-code',
      label: 'Promo code',
      icon: <Gift className="h-4 w-4 text-[#f3b644]" aria-hidden="true" />,
    },
    {
      id: 'connect-telegram',
      label: 'Connect Telegram',
      icon: <Link2 className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="CAMPUS navigation menu"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-[308px] max-w-[85vw] flex-col justify-between border-r border-[#1d2836] bg-[#0c121a] px-4 py-6">
        <div>
          <div className="mb-5 flex items-center justify-between px-2">
            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#7f91a6] uppercase">
              CAMPUS MENU
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#8fa1b5] transition-colors hover:bg-[#131c28] hover:text-[#e6edf5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] cursor-pointer sm:hidden"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1.5" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] cursor-pointer ${
                    isActive
                      ? 'border border-[#27564a] bg-[#132c26] text-[#f3f8f6]'
                      : 'border border-transparent text-[#d7e0eb] hover:bg-[#131c28] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3 whitespace-nowrap">
                    <span
                      className={
                        isActive ? 'text-[#7ee2b8]' : 'text-[#9eb0c4]'
                      }
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>

                  {item.count !== undefined && (
                    <span className="font-mono text-xs text-[#7ee2b8] tabular-nums">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Direct quick deposit link */}
          <div className="mt-4 border-t border-[#16202c] pt-4 px-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDeposit();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#245648] bg-[#0e1f1c] px-3.5 py-2 text-xs font-semibold text-[#7ee2b8] transition-colors hover:border-[#7ee2b8]/70 hover:bg-[#132924] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Quick manual deposit</span>
            </button>
          </div>
        </div>

        {/* Bottom Pinned Actions */}
        <div className="space-y-2.5 pt-4">
          <button
            type="button"
            onClick={() => {
              onJoinTelegram();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold text-[#e4ecf5] transition-colors hover:bg-[#131c28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] cursor-pointer"
          >
            <Send className="h-4 w-4 text-[#c8d4e3]" aria-hidden="true" />
            <span>Join Our Telegram</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="flex w-full items-center gap-3 rounded-lg border border-[#5a2832] bg-[#13131b] px-3.5 py-2.5 text-left text-sm font-semibold text-[#f1e4e7] transition-colors hover:border-[#7c3745] hover:bg-[#1e151a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a9b0] cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-[#e5a9b0]" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
