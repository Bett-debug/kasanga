import { useState } from 'react';
import {
  INITIAL_CATALOG_ITEMS,
  INITIAL_NOTIFICATIONS,
  PROMO_CODES,
} from './data/mockStorefront';
import {
  AlertBannerState,
  CatalogItem,
  DepositRecord,
  NavSection,
  NotificationItem,
  OrderRecord,
} from './types/campus';
import { TopNav } from './components/TopNav';
import { NavigationDrawer } from './components/NavigationDrawer';
import { AvailableItemsView } from './components/AvailableItemsView';
import { ManualDepositModal } from './components/ManualDepositModal';
import { ConnectTelegramView } from './components/ConnectTelegramView';
import {
  DepositsView,
  MyOrdersView,
  NotificationsView,
  PromoCodeView,
  WishlistView,
} from './components/SecondaryViews';

const CUSTOMER_ID = '6E586DCB';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [activeSection, setActiveSection] =
    useState<NavSection>('available-items');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(
    INITIAL_CATALOG_ITEMS
  );
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);

  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState<string | null>(null);

  const [alertBanner, setAlertBanner] = useState<AlertBannerState | null>({
    type: 'error',
    message: 'Purchase failed: Insufficient wallet balance. Available: $0.00',
  });

  const handleBuyItem = (item: CatalogItem) => {
    if (walletBalance < item.price) {
      setAlertBanner({
        type: 'error',
        message: `Purchase failed: Insufficient wallet balance. Available: $${walletBalance.toFixed(2)}`,
      });
      return;
    }

    const nextBalance = Number((walletBalance - item.price).toFixed(2));
    setWalletBalance(nextBalance);

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      itemTitle: item.title,
      base: item.base,
      brand: item.brand,
      type: item.type,
      location: item.location,
      price: item.price,
      purchasedAt: 'Just now',
      status: 'Delivered',
      referenceCode: `CMP-${item.base}-${item.lastFour}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCatalogItems((prev) => prev.filter((c) => c.id !== item.id));
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(item.id);
      return next;
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order confirmed',
        message: `${item.title} (Base ${item.base}) purchased for $${item.price.toFixed(2)}. View details in My orders.`,
        timestamp: 'Just now',
        read: false,
        tone: 'success',
      },
      ...prev,
    ]);

    setAlertBanner({
      type: 'success',
      message: `Purchase completed: ${item.title} added to My orders. Remaining balance: $${nextBalance.toFixed(2)}`,
    });
  };

  const handleToggleSave = (item: CatalogItem) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  };

  const handleSubmitDeposit = (
    payload: Omit<DepositRecord, 'id' | 'status' | 'submittedAt'>
  ) => {
    const newDeposit: DepositRecord = {
      ...payload,
      id: `dep-${Date.now()}`,
      status: 'Pending Review',
      submittedAt: 'Just now',
    };

    setDeposits((prev) => [newDeposit, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Manual deposit submitted',
        message: `$${payload.amount.toFixed(2)} via ${payload.walletLabel} (Ref: ${payload.reference}) is queued for administrator review.`,
        timestamp: 'Just now',
        read: false,
        tone: 'info',
      },
      ...prev,
    ]);

    setAlertBanner({
      type: 'success',
      message: `Deposit submitted for review: $${payload.amount.toFixed(2)} via ${payload.walletLabel}. Balance credits after admin approval.`,
    });
  };

  const handleRedeemCode = (
    code: string
  ): { ok: boolean; message: string } => {
    if (!code) {
      return { ok: false, message: 'Enter a promo code to redeem.' };
    }
    if (redeemedCodes.includes(code)) {
      return { ok: false, message: `Promo code ${code} has already been redeemed.` };
    }
    const promo = PROMO_CODES[code];
    if (!promo) {
      return {
        ok: false,
        message: 'Invalid or expired promo code. Try CAMPUS10, WELCOME25, or MINT50.',
      };
    }

    const nextBalance = Number((walletBalance + promo.credit).toFixed(2));
    setWalletBalance(nextBalance);
    setRedeemedCodes((prev) => [...prev, code]);
    setAlertBanner({
      type: 'success',
      message: `${promo.label} applied (+$${promo.credit.toFixed(2)}). Available wallet balance: $${nextBalance.toFixed(2)}`,
    });

    return {
      ok: true,
      message: `Credited $${promo.credit.toFixed(2)} (${promo.label}) to your wallet.`,
    };
  };

  const handleRefreshTelegram = () => {
    if (telegramConnected) {
      setAlertBanner({
        type: 'info',
        message: `Telegram connection verified with ${telegramHandle} via @Prof_19bot.`,
      });
      return;
    }

    setTelegramConnected(true);
    setTelegramHandle('@campus_member');
    setAlertBanner({
      type: 'success',
      message: 'Telegram account @campus_member linked to @Prof_19bot.',
    });
  };

  const handleOpenTelegramBot = () => {
    setAlertBanner({
      type: 'info',
      message:
        'Open @Prof_19bot in Telegram and send your generated one-time verification code to link your account.',
    });
  };

  const handleJoinTelegram = () => {
    setActiveSection('connect-telegram');
    setAlertBanner({
      type: 'info',
      message:
        'Official CAMPUS channel & support bot: @Prof_19bot on Telegram.',
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const savedItems = catalogItems.filter((item) => savedIds.has(item.id));
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b10] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#1d2836] bg-[#0c121a] p-8 text-center">
          <div className="text-2xl font-extrabold tracking-tight text-[#f3f7fb]">
            CAMPUS<span className="text-[#7ee2b8]">.</span>
          </div>
          <h1 className="mt-4 text-lg font-bold text-[#e6edf5]">
            Session signed out
          </h1>
          <p className="mt-2 text-sm text-[#8b9cb0]">
            You have safely signed out of customer account{' '}
            <span className="font-mono text-[#c5d2e1]">{CUSTOMER_ID}</span>.
          </p>
          <button
            type="button"
            onClick={() => setIsSignedIn(true)}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#7ee2b8] px-4 text-sm font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] cursor-pointer"
          >
            Sign back in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b10] text-[#e6edf5]">
      <TopNav
        walletBalance={walletBalance}
        customerId={CUSTOMER_ID}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenDeposit={() => setIsDepositModalOpen(true)}
        onSignOut={() => setIsSignedIn(false)}
        onGoHome={() => setActiveSection('available-items')}
      />

      <NavigationDrawer
        isOpen={isMenuOpen}
        activeSection={activeSection}
        unreadNotifications={unreadCount}
        wishlistCount={savedItems.length}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={(section) => setActiveSection(section)}
        onOpenDeposit={() => setIsDepositModalOpen(true)}
        onJoinTelegram={handleJoinTelegram}
        onSignOut={() => setIsSignedIn(false)}
      />

      <ManualDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSubmitDeposit={handleSubmitDeposit}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        {/* Alert Banner */}
        {alertBanner && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-6 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm font-medium ${
              alertBanner.type === 'error'
                ? 'border-[#69232c] bg-[#361419] text-[#e5a9b0]'
                : alertBanner.type === 'success'
                  ? 'border-[#265446] bg-[#102821] text-[#8be8c2]'
                  : 'border-[#253a54] bg-[#0f1c2e] text-[#c3d5ea]'
            }`}
          >
            <span>{alertBanner.message}</span>
            <button
              type="button"
              onClick={() => setAlertBanner(null)}
              aria-label="Dismiss alert"
              className="text-xs font-semibold opacity-75 transition-opacity hover:opacity-100 cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active View Content */}
        {activeSection === 'available-items' && (
          <AvailableItemsView
            items={catalogItems}
            savedIds={savedIds}
            onBuyItem={handleBuyItem}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeSection === 'my-orders' && (
          <MyOrdersView
            orders={orders}
            onBrowseCatalog={() => setActiveSection('available-items')}
          />
        )}

        {activeSection === 'deposits' && (
          <DepositsView
            deposits={deposits}
            walletBalance={walletBalance}
            onOpenDepositModal={() => setIsDepositModalOpen(true)}
          />
        )}

        {activeSection === 'wishlist' && (
          <WishlistView
            items={savedItems}
            onBuyItem={handleBuyItem}
            onRemoveSaved={handleToggleSave}
            onBrowseCatalog={() => setActiveSection('available-items')}
          />
        )}

        {activeSection === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onMarkRead={handleMarkRead}
          />
        )}

        {activeSection === 'promo-code' && (
          <PromoCodeView
            redeemedCodes={redeemedCodes}
            onRedeemCode={handleRedeemCode}
          />
        )}

        {activeSection === 'connect-telegram' && (
          <ConnectTelegramView
            isConnected={telegramConnected}
            telegramHandle={telegramHandle}
            onRefreshStatus={handleRefreshTelegram}
            onOpenBot={handleOpenTelegramBot}
          />
        )}
      </main>
    </div>
  );
}
