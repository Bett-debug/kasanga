import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Copy, X } from 'lucide-react';
import { PAYMENT_WALLETS } from '../data/mockStorefront';
import { DepositRecord } from '../types/campus';

interface ManualDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDeposit: (deposit: Omit<DepositRecord, 'id' | 'status' | 'submittedAt'>) => void;
}

export const ManualDepositModal: React.FC<ManualDepositModalProps> = ({
  isOpen,
  onClose,
  onSubmitDeposit,
}) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [amountSent, setAmountSent] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedWallet = PAYMENT_WALLETS.find((w) => w.id === selectedWalletId);

  const handleCopyAddress = async () => {
    if (!selectedWallet) {
      setFormError('Choose a payment wallet first to copy its address.');
      return;
    }
    try {
      await navigator.clipboard.writeText(selectedWallet.address);
    } catch {
      // Fallback silent if clipboard permissions unavailable
    }
    setFormError(null);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setProofFile(null);
      return;
    }
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFormError('Payment proof exceeds the 5 MB file size limit.');
      setProofFile(null);
      return;
    }
    setFormError(null);
    setProofFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) {
      setFormError('Please choose an enabled payment wallet.');
      return;
    }
    const parsedAmount = Number.parseFloat(amountSent);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError('Enter a valid deposit amount greater than $0.00.');
      return;
    }
    if (!reference.trim()) {
      setFormError('Enter a transaction ID or payment reference.');
      return;
    }
    if (!proofFile) {
      setFormError('Attach your payment proof (JPG, PNG, WEBP or PDF).');
      return;
    }

    onSubmitDeposit({
      walletLabel: selectedWallet.label,
      amount: parsedAmount,
      reference: reference.trim(),
      proofFileName: proofFile.name,
    });

    // Reset form state after successful submission
    setSelectedWalletId('');
    setAmountSent('');
    setReference('');
    setProofFile(null);
    setFormError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-deposit-title"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[464px] max-h-[92vh] overflow-y-auto rounded-xl border border-[#1d2836] bg-[#0c121a] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2
            id="manual-deposit-title"
            className="text-xl font-bold tracking-tight text-[#f3f7fb]"
          >
            Manual deposit
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#4c242d] bg-[#16131c] px-3.5 text-sm font-semibold text-[#f1e4e7] transition-colors hover:border-[#783745] hover:bg-[#1f1720] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a9b0] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Close</span>
          </button>
        </div>

        {/* Helper description */}
        <p className="mt-4 text-sm leading-relaxed text-[#95a6ba]">
          Select one of the payment wallets currently enabled by CAMPUS, send your
          payment, then submit the details and proof. Your balance is credited only
          after administrator approval.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Choose payment wallet */}
          <div>
            <label
              htmlFor="payment-wallet-select"
              className="block text-sm font-semibold text-[#e6edf5]"
            >
              Choose payment wallet
            </label>
            <div className="relative mt-2">
              <select
                id="payment-wallet-select"
                value={selectedWalletId}
                onChange={(e) => {
                  setSelectedWalletId(e.target.value);
                  setFormError(null);
                }}
                className="h-11 w-full appearance-none rounded-lg border border-[#223042] bg-[#0a1018] pl-3.5 pr-10 text-sm text-[#e6edf5] transition-colors focus:border-[#374d68] focus:outline-none focus:ring-1 focus:ring-[#7ee2b8]/60 cursor-pointer"
              >
                <option value="">Choose a payment wallet</option>
                {PAYMENT_WALLETS.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.label} — {wallet.network}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9eb0c4]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Payment details info box */}
          <div className="rounded-lg border border-[#1f2f46] bg-[#0f1b2e] p-4">
            <h3 className="text-sm font-bold text-[#f2f6fb]">Payment details</h3>

            {selectedWallet ? (
              <div className="mt-2 space-y-2">
                <p className="text-xs leading-relaxed text-[#adc0d6]">
                  {selectedWallet.instructions}
                </p>
                <div className="rounded-md border border-[#1c2b40] bg-[#09111e] px-3 py-2 font-mono text-xs text-[#7ee2b8] break-all">
                  {selectedWallet.address}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#b7c6d8]">
                Choose a wallet to view payment instructions.
              </p>
            )}

            <button
              type="button"
              onClick={handleCopyAddress}
              className="mt-3.5 inline-flex h-9 items-center gap-2 rounded-lg border border-[#273850] bg-[#111b2b] px-3.5 text-xs font-bold text-[#edf3fa] transition-colors hover:border-[#3b5272] hover:bg-[#172438] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#7ee2b8]" aria-hidden="true" />
                  <span className="text-[#7ee2b8]">Wallet address copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-[#9eb0c4]" aria-hidden="true" />
                  <span>Copy wallet address</span>
                </>
              )}
            </button>
          </div>

          {/* Amount sent */}
          <div>
            <label
              htmlFor="amount-sent-input"
              className="block text-sm font-semibold text-[#e6edf5]"
            >
              Amount sent
            </label>
            <input
              id="amount-sent-input"
              type="number"
              step="0.01"
              min="1"
              value={amountSent}
              onChange={(e) => {
                setAmountSent(e.target.value);
                setFormError(null);
              }}
              placeholder="Amount you sent"
              className="mt-2 h-11 w-full rounded-lg border border-[#223042] bg-[#0a1018] px-3.5 text-sm text-[#e6edf5] placeholder-[#68798e] tabular-nums transition-colors focus:border-[#374d68] focus:outline-none focus:ring-1 focus:ring-[#7ee2b8]/60"
            />
          </div>

          {/* Transaction ID / payment reference */}
          <div>
            <label
              htmlFor="tx-reference-input"
              className="block text-sm font-semibold text-[#e6edf5]"
            >
              Transaction ID / payment reference
            </label>
            <input
              id="tx-reference-input"
              type="text"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                setFormError(null);
              }}
              placeholder="Transaction ID or payment reference"
              className="mt-2 h-11 w-full rounded-lg border border-[#223042] bg-[#0a1018] px-3.5 text-sm text-[#e6edf5] placeholder-[#68798e] transition-colors focus:border-[#374d68] focus:outline-none focus:ring-1 focus:ring-[#7ee2b8]/60"
            />
          </div>

          {/* Payment proof */}
          <div>
            <label
              htmlFor="payment-proof-input"
              className="block text-sm font-semibold text-[#e6edf5]"
            >
              Payment proof (required)
            </label>
            <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-[#223042] bg-[#0a1018] px-3">
              <input
                ref={fileInputRef}
                id="payment-proof-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded border border-[#8e99a8] bg-[#e9edf2] px-2.5 py-1 text-xs font-semibold text-[#111827] transition-colors hover:bg-white cursor-pointer shrink-0"
              >
                Choose File
              </button>
              <span className="truncate text-sm text-[#b9c6d6]">
                {proofFile ? proofFile.name : 'No file chosen'}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#8b9cb0]">
              JPG, PNG, WEBP or PDF. Maximum 5 MB.
            </p>
          </div>

          {/* Validation error */}
          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-[#69232c] bg-[#361419] px-3.5 py-2.5 text-xs font-medium text-[#e5a9b0]"
            >
              {formError}
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            className="mt-1 flex h-11 w-full items-center justify-center rounded-lg bg-[#7ee2b8] px-4 text-sm font-bold text-[#071018] transition-colors hover:bg-[#94ecc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] cursor-pointer"
          >
            Submit deposit for review
          </button>
        </form>
      </div>
    </div>
  );
};
