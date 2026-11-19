import React from 'react';
import { CardTheme } from '../types/campus';

interface CardThumbnailProps {
  theme: CardTheme;
  type: string;
  size?: 'sm' | 'lg';
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  theme,
  type,
  size = 'sm',
}) => {
  const isLarge = size === 'lg';

  const bgClasses: Record<CardTheme, string> = {
    scarlet:
      'bg-gradient-to-br from-[#232258] via-[#13183b] to-[#34183d] border-[#31386b]/70',
    'wells-fargo':
      'bg-gradient-to-br from-[#9e1422] via-[#710d1b] to-[#420712] border-[#b72838]/60',
    emerald:
      'bg-gradient-to-br from-[#0f3b35] via-[#0c2726] to-[#11243a] border-[#26695d]/60',
    obsidian:
      'bg-gradient-to-br from-[#1f293b] via-[#111827] to-[#090d16] border-[#38465d]/70',
  };

  const brandWord =
    theme === 'scarlet'
      ? 'SCARLET'
      : theme === 'wells-fargo'
        ? 'WELLS FARGO'
        : theme === 'emerald'
          ? 'CITI'
          : 'CHASE';

  const isMastercard = type.toLowerCase().includes('mastercard');

  return (
    <div
      className={`relative overflow-hidden border select-none shrink-0 ${bgClasses[theme]} ${
        isLarge
          ? 'w-full h-36 rounded-lg p-4 flex flex-col justify-between'
          : 'w-[50px] h-[32px] rounded-[5px] px-1.5 py-1 flex flex-col justify-between'
      }`}
      aria-hidden="true"
    >
      {/* Subtle diagonal sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-white/[0.12]" />

      {/* Top row */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className={`font-bold tracking-wider text-white/95 uppercase leading-none ${
            isLarge ? 'text-xs' : 'text-[5.5px]'
          }`}
        >
          {brandWord}
        </span>
        {/* EMV chip */}
        <div
          className={`rounded-[2px] border border-amber-200/40 bg-gradient-to-br from-amber-200/60 to-amber-400/30 ${
            isLarge ? 'w-7 h-5' : 'w-2.5 h-1.5'
          }`}
        />
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex items-end justify-between">
        {isLarge ? (
          <span className="font-mono text-xs tracking-widest text-white/70 tabular-nums">
            •••• •••• ••••
          </span>
        ) : (
          <span className="h-[2px] w-4 rounded-full bg-white/30" />
        )}

        {isMastercard ? (
          <div className="flex items-center -space-x-1">
            <span
              className={`rounded-full bg-[#eb001b]/90 ${
                isLarge ? 'w-4 h-4' : 'w-2 h-2'
              }`}
            />
            <span
              className={`rounded-full bg-[#f79e1b]/90 ${
                isLarge ? 'w-4 h-4' : 'w-2 h-2'
              }`}
            />
          </div>
        ) : (
          <span
            className={`font-extrabold italic tracking-tight text-white/95 leading-none ${
              isLarge ? 'text-sm' : 'text-[6px]'
            }`}
          >
            VISA
          </span>
        )}
      </div>
    </div>
  );
};
