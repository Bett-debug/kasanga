import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface ConnectTelegramViewProps {
  isConnected: boolean;
  telegramHandle: string | null;
  onRefreshStatus: () => void;
  onOpenBot: () => void;
}

export const ConnectTelegramView: React.FC<ConnectTelegramViewProps> = ({
  isConnected,
  telegramHandle,
  onRefreshStatus,
  onOpenBot,
}) => {
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsRemaining]);

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomPart = '';
    for (let i = 0; i < 8; i += 1) {
      randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
    setVerificationCode(`CMP-${randomPart}`);
    setSecondsRemaining(600);
    setCopiedCode(false);
  };

  const handleCopyCode = async () => {
    if (!verificationCode) return;
    try {
      await navigator.clipboard.writeText(verificationCode);
    } catch {
      // ignore if clipboard blocked
    }
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1800);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <section
      aria-labelledby="connect-telegram-heading"
      className="rounded-xl border border-[#1d2836] bg-[#0c121a] p-6 sm:p-8"
    >
      {/* Uppercase kicker */}
      <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[#7ee2b8] uppercase">
        ACCOUNT CONNECTION
      </p>

      {/* Heading */}
      <h1
        id="connect-telegram-heading"
        className="mt-2 text-2xl font-bold tracking-tight text-[#f3f7fb]"
      >
        Connect Telegram
      </h1>

      {/* Instructions */}
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9fb0c4]">
        Securely connect{' '}
        <strong className="font-bold text-[#f1f5f9]">
          your existing CAMPUS account
        </strong>{' '}
        to <span className="font-medium text-[#d7e2ef]">@Prof_19bot</span>.
        Generate a one-time code here, then send it to the bot. Your CAMPUS
        password is never needed in Telegram.
      </p>

      {/* Status Box */}
      <div className="mt-6 max-w-2xl rounded-lg border border-[#1f2f46] bg-[#0f1b2e] px-5 py-4">
        {isConnected && telegramHandle ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#7ee2b8]">
                Connected to {telegramHandle}
              </p>
              <p className="mt-0.5 text-xs text-[#a9bbd0]">
                Deposit approvals and order receipts will be delivered directly via
                @Prof_19bot.
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-[#7ee2b8]">
              VERIFIED
            </span>
          </div>
        ) : verificationCode && secondsRemaining > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#9eb0c4]">
                Send this one-time verification code to{' '}
                <span className="font-semibold text-[#e6edf5]">@Prof_19bot</span>
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="font-mono text-lg font-bold tracking-wider text-[#7ee2b8] tabular-nums">
                  {verificationCode}
                </span>
                <span className="font-mono text-xs text-[#8fa1b5] tabular-nums">
                  Expires in {formatTime(secondsRemaining)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#2a3c55] bg-[#132033] px-3 text-xs font-semibold text-[#e6edf5] transition-colors hover:border-[#3c5475] cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#7ee2b8]" aria-hidden="true" />
                  <span className="text-[#7ee2b8]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy code</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#c5d2e1]">
            Not connected yet. Generate a one-time code and send it to @Prof_19bot.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateCode}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#7ee2b8] px-4 text-sm font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Generate verification code
        </button>

        <button
          type="button"
          onClick={onRefreshStatus}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#253346] bg-[#131c28] px-4 text-sm font-bold text-[#edf3fa] transition-colors hover:border-[#394d66] hover:bg-[#192434] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Refresh connection status
        </button>

        <button
          type="button"
          onClick={onOpenBot}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#253346] bg-[#131c28] px-4 text-sm font-bold text-[#edf3fa] underline underline-offset-4 transition-colors hover:border-[#394d66] hover:bg-[#192434] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Open Telegram bot
        </button>
      </div>

      {/* Security Footer Note */}
      <p className="mt-6 text-xs text-[#8495aa]">
        For your security, the website stores only a hash of the code. Never share
        this code with anyone except the CAMPUS Telegram bot.
      </p>
    </section>
  );
};
