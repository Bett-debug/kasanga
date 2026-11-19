import React, { useState } from 'react';
import { Gift, Heart, Plus, ReceiptText, Trash2 } from 'lucide-react';
import {
  CatalogItem,
  DepositRecord,
  NotificationItem,
  OrderRecord,
} from '../types/campus';
import { CardThumbnail } from './CardThumbnail';

interface MyOrdersViewProps {
  orders: OrderRecord[];
  onBrowseCatalog: () => void;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({
  orders,
  onBrowseCatalog,
}) => {
  return (
    <section aria-labelledby="orders-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 id="orders-heading" className="text-xl font-bold text-[#f1f5f9]">
          My orders
        </h1>
        <span className="font-mono text-xs text-[#8899ad] tabular-nums">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-[#1d2836] bg-[#0c121a] px-6 py-12 text-center">
          <ReceiptText
            className="mx-auto h-8 w-8 text-[#5d6f85]"
            aria-hidden="true"
          />
          <h2 className="mt-3 text-base font-bold text-[#e6edf5]">
            No completed orders yet
          </h2>
          <p className="mt-1 text-sm text-[#8b9cb0]">
            Fund your wallet via Manual deposit or redeem a promo code to purchase
            items from the storefront.
          </p>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#7ee2b8] px-4 text-sm font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] cursor-pointer"
          >
            Browse available items
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#1d2836] bg-[#0c121a]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <thead className="border-b border-[#192331] bg-[#0d141e]">
                <tr className="text-xs font-semibold text-[#9aa9bc]">
                  <th className="py-3.5 pl-4 pr-3">Item</th>
                  <th className="px-3 py-3.5">Base</th>
                  <th className="px-3 py-3.5">Location</th>
                  <th className="px-3 py-3.5">Reference</th>
                  <th className="px-3 py-3.5">Purchased</th>
                  <th className="px-3 py-3.5">Price</th>
                  <th className="py-3.5 pl-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151e2b]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#101823]">
                    <td className="py-3.5 pl-4 pr-3">
                      <div className="text-xs font-bold text-[#f2f6fb] uppercase">
                        {order.itemTitle}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[#8b9cb0]">
                        {order.brand} &bull; {order.type}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-xs text-[#cad5e3] tabular-nums">
                      {order.base}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-[#cad5e3]">
                      {order.location}
                    </td>
                    <td className="px-3 py-3.5 font-mono text-xs text-[#7ee2b8]">
                      {order.referenceCode}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-[#8b9cb0] tabular-nums">
                      {order.purchasedAt}
                    </td>
                    <td className="px-3 py-3.5 text-sm font-bold text-[#f5f8fc] tabular-nums">
                      ${order.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 pl-3 pr-4 text-xs font-semibold text-[#7ee2b8]">
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

interface DepositsViewProps {
  deposits: DepositRecord[];
  walletBalance: number;
  onOpenDepositModal: () => void;
}

export const DepositsView: React.FC<DepositsViewProps> = ({
  deposits,
  walletBalance,
  onOpenDepositModal,
}) => {
  return (
    <section aria-labelledby="deposits-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="deposits-heading" className="text-xl font-bold text-[#f1f5f9]">
            Deposits
          </h1>
          <p className="mt-0.5 text-xs text-[#8b9cb0] tabular-nums">
            Available wallet balance: ${walletBalance.toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDepositModal}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7ee2b8] px-4 text-sm font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] cursor-pointer"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New manual deposit</span>
        </button>
      </div>

      {deposits.length === 0 ? (
        <div className="rounded-xl border border-[#1d2836] bg-[#0c121a] px-6 py-12 text-center">
          <h2 className="text-base font-bold text-[#e6edf5]">
            No deposits submitted yet
          </h2>
          <p className="mt-1 text-sm text-[#8b9cb0]">
            Select an enabled payment wallet, submit your transfer reference and
            proof, and track administrator review here.
          </p>
          <button
            type="button"
            onClick={onOpenDepositModal}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-[#245648] bg-[#0e1f1c] px-4 text-sm font-semibold text-[#7ee2b8] transition-colors hover:bg-[#132924] cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Submit manual deposit</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#1d2836] bg-[#0c121a]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] border-collapse text-left">
              <thead className="border-b border-[#192331] bg-[#0d141e]">
                <tr className="text-xs font-semibold text-[#9aa9bc]">
                  <th className="py-3.5 pl-4 pr-3">Wallet</th>
                  <th className="px-3 py-3.5">Amount</th>
                  <th className="px-3 py-3.5">Reference</th>
                  <th className="px-3 py-3.5">Proof</th>
                  <th className="px-3 py-3.5">Submitted</th>
                  <th className="py-3.5 pl-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151e2b]">
                {deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-[#101823]">
                    <td className="py-3.5 pl-4 pr-3 text-xs font-semibold text-[#f1f5f9]">
                      {dep.walletLabel}
                    </td>
                    <td className="px-3 py-3.5 text-sm font-bold text-[#f5f8fc] tabular-nums">
                      ${dep.amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-3.5 font-mono text-xs text-[#cad5e3]">
                      {dep.reference}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-[#9eb0c4]">
                      {dep.proofFileName}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-[#8b9cb0] tabular-nums">
                      {dep.submittedAt}
                    </td>
                    <td className="py-3.5 pl-3 pr-4 text-xs font-semibold text-[#f3c669]">
                      {dep.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

interface WishlistViewProps {
  items: CatalogItem[];
  onBuyItem: (item: CatalogItem) => void;
  onRemoveSaved: (item: CatalogItem) => void;
  onBrowseCatalog: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  items,
  onBuyItem,
  onRemoveSaved,
  onBrowseCatalog,
}) => {
  return (
    <section aria-labelledby="wishlist-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 id="wishlist-heading" className="text-xl font-bold text-[#f1f5f9]">
          Wishlist
        </h1>
        <span className="font-mono text-xs text-[#8899ad] tabular-nums">
          {items.length} saved
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-[#1d2836] bg-[#0c121a] px-6 py-12 text-center">
          <Heart className="mx-auto h-8 w-8 text-[#5d6f85]" aria-hidden="true" />
          <h2 className="mt-3 text-base font-bold text-[#e6edf5]">
            Your wishlist is empty
          </h2>
          <p className="mt-1 text-sm text-[#8b9cb0]">
            Click Save on any item in Available items to bookmark it here for quick
            access.
          </p>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-[#253548] bg-[#131c28] px-4 text-sm font-semibold text-[#e6edf5] transition-colors hover:bg-[#1a2636] cursor-pointer"
          >
            Explore catalog
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#151e2b] overflow-hidden rounded-xl border border-[#1d2836] bg-[#0c121a]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3.5">
                <CardThumbnail theme={item.theme} type={item.type} />
                <div>
                  <h2 className="text-sm font-bold text-[#f2f6fb] uppercase">
                    {item.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#8b9cb0] tabular-nums">
                    Base {item.base} &bull; {item.brand} &bull; {item.type} &bull;{' '}
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-extrabold text-[#f5f8fc] tabular-nums">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onBuyItem(item)}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-[#7ee2b8] px-3.5 text-xs font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] cursor-pointer"
                >
                  Buy now
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveSaved(item)}
                  aria-label={`Remove ${item.title} from wishlist`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#253346] bg-[#101824] px-3 text-xs font-semibold text-[#e4ecf5] transition-colors hover:border-[#4c242d] hover:text-[#e5a9b0] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  onMarkRead,
}) => {
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <section aria-labelledby="notifications-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1
          id="notifications-heading"
          className="text-xl font-bold text-[#f1f5f9]"
        >
          Notifications
        </h1>

        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex h-9 items-center rounded-lg border border-[#253346] bg-[#131c28] px-3.5 text-xs font-semibold text-[#e6edf5] transition-colors hover:bg-[#192434] cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="divide-y divide-[#151e2b] overflow-hidden rounded-xl border border-[#1d2836] bg-[#0c121a]">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center ${
              notif.read ? 'opacity-75' : 'bg-[#0e1621]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#f2f6fb]">
                  {notif.title}
                </h2>
                {!notif.read && (
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#7ee2b8]">
                    NEW
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#9eb0c4]">
                {notif.message}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-[#738499] tabular-nums">
                {notif.timestamp}
              </span>
              {!notif.read && (
                <button
                  type="button"
                  onClick={() => onMarkRead(notif.id)}
                  className="text-xs font-semibold text-[#7ee2b8] hover:underline cursor-pointer"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

interface PromoCodeViewProps {
  redeemedCodes: string[];
  onRedeemCode: (code: string) => { ok: boolean; message: string };
}

export const PromoCodeView: React.FC<PromoCodeViewProps> = ({
  redeemedCodes,
  onRedeemCode,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onRedeemCode(codeInput.trim().toUpperCase());
    setFeedback(res);
    if (res.ok) {
      setCodeInput('');
    }
  };

  return (
    <section
      aria-labelledby="promo-heading"
      className="rounded-xl border border-[#1d2836] bg-[#0c121a] p-6 sm:p-8"
    >
      <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[#7ee2b8] uppercase">
        WALLET VOUCHERS
      </p>
      <h1 id="promo-heading" className="mt-2 text-2xl font-bold text-[#f3f7fb]">
        Promo code
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#9fb0c4]">
        Enter an active CAMPUS voucher code to credit your wallet balance
        immediately. Try <span className="font-mono text-[#e6edf5]">CAMPUS10</span>{' '}
        or <span className="font-mono text-[#e6edf5]">WELCOME25</span>.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex max-w-lg flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={codeInput}
          onChange={(e) => {
            setCodeInput(e.target.value);
            setFeedback(null);
          }}
          placeholder="Enter promo code"
          aria-label="Promo code"
          className="h-11 flex-1 rounded-lg border border-[#223042] bg-[#0a1018] px-3.5 font-mono text-sm text-[#e6edf5] uppercase placeholder-[#68798e] focus:border-[#374d68] focus:outline-none focus:ring-1 focus:ring-[#7ee2b8]/60"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7ee2b8] px-5 text-sm font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Gift className="h-4 w-4" aria-hidden="true" />
          <span>Apply code</span>
        </button>
      </form>

      {feedback && (
        <div
          role="status"
          className={`mt-4 max-w-lg rounded-lg border px-4 py-3 text-xs font-medium ${
            feedback.ok
              ? 'border-[#27564a] bg-[#0f241f] text-[#7ee2b8]'
              : 'border-[#69232c] bg-[#361419] text-[#e5a9b0]'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {redeemedCodes.length > 0 && (
        <div className="mt-6 border-t border-[#16202c] pt-4">
          <p className="text-xs font-semibold text-[#8b9cb0]">
            Redeemed vouchers this session:
          </p>
          <p className="mt-1 font-mono text-xs text-[#7ee2b8]">
            {redeemedCodes.join(' • ')}
          </p>
        </div>
      )}
    </section>
  );
};
