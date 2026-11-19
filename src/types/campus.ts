export type NavSection =
  | 'available-items'
  | 'my-orders'
  | 'deposits'
  | 'wishlist'
  | 'notifications'
  | 'promo-code'
  | 'connect-telegram';

export type ViewMode = 'table' | 'cards';

export type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'hit-rate';

export type CardTheme = 'scarlet' | 'wells-fargo' | 'emerald' | 'obsidian';

export interface CatalogItem {
  id: string;
  title: string;
  score: number;
  regionLabel: string;
  hitRate: number;
  base: string;
  brand: string;
  type: string;
  location: string;
  price: number;
  addedOrder: number;
  theme: CardTheme;
  lastFour: string;
}

export interface PaymentWallet {
  id: string;
  label: string;
  network: string;
  address: string;
  instructions: string;
  minDeposit: number;
}

export interface DepositRecord {
  id: string;
  walletLabel: string;
  amount: number;
  reference: string;
  proofFileName: string;
  status: 'Pending Review' | 'Approved' | 'Declined';
  submittedAt: string;
}

export interface OrderRecord {
  id: string;
  itemTitle: string;
  base: string;
  brand: string;
  type: string;
  location: string;
  price: number;
  purchasedAt: string;
  status: 'Delivered';
  referenceCode: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  tone: 'info' | 'warning' | 'success';
}

export interface AlertBannerState {
  type: 'error' | 'success' | 'info';
  message: string;
}
