import React, { useMemo, useState } from 'react';
import { Award, ChevronDown, Heart, Search } from 'lucide-react';
import { CatalogItem, SortOption, ViewMode } from '../types/campus';
import { CardThumbnail } from './CardThumbnail';

interface AvailableItemsViewProps {
  items: CatalogItem[];
  savedIds: Set<string>;
  onBuyItem: (item: CatalogItem) => void;
  onToggleSave: (item: CatalogItem) => void;
}

export const AvailableItemsView: React.FC<AvailableItemsViewProps> = ({
  items,
  savedIds,
  onBuyItem,
  onToggleSave,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBase, setSelectedBase] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const baseOptions = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.base)));
    return unique.sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = items.filter((item) => {
      if (selectedBase !== 'all' && item.base !== selectedBase) {
        return false;
      }
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.base.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'hit-rate':
          return b.hitRate - a.hitRate || b.score - a.score;
        case 'recent':
        default:
          return a.addedOrder - b.addedOrder;
      }
    });
  }, [items, searchQuery, selectedBase, sortBy]);

  return (
    <section aria-labelledby="available-items-heading" className="space-y-4">
      {/* Header Row + Segmented Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1
          id="available-items-heading"
          className="text-xl font-bold tracking-tight text-[#f1f5f9]"
        >
          Available items
        </h1>

        <div
          className="inline-flex items-center rounded-lg border border-[#223042] bg-[#0e1520] p-0.5"
          role="group"
          aria-label="Catalog layout mode"
        >
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#b8c2ff] text-[#071018]'
                : 'text-[#b5c2d4] hover:text-white'
            }`}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-[#b8c2ff] text-[#071018]'
                : 'text-[#b5c2d4] hover:text-white'
            }`}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#738499]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search available items"
            aria-label="Search available items"
            className="h-11 w-full rounded-lg border border-[#1d2836] bg-[#0a1018] pl-10 pr-4 text-sm text-[#e6edf5] placeholder-[#6e7f94] transition-colors focus:border-[#344963] focus:outline-none focus:ring-1 focus:ring-[#7ee2b8]/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[146px] flex-1 sm:flex-none">
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              aria-label="Filter by base"
              className="h-11 w-full appearance-none rounded-lg border border-[#1d2836] bg-[#0d1520] pl-3.5 pr-9 text-sm font-medium text-[#e6edf5] transition-colors focus:border-[#344963] focus:outline-none focus:ring-1 focus:ring-[#7ee2b8]/60 cursor-pointer"
            >
              <option value="all">All bases</option>
              {baseOptions.map((base) => (
                <option key={base} value={base}>
                  Base {base}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9eb0c4]"
              aria-hidden="true"
            />
          </div>

          <div className="relative min-w-[164px] flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort items"
              className="h-11 w-full appearance-none rounded-lg border border-[#1d2836] bg-[#0d1520] pl-3.5 pr-9 text-sm font-medium text-[#e6edf5] transition-colors focus:border-[#344963] focus:outline-none focus:ring-1 focus:ring-[#7ee2b8]/60 cursor-pointer"
            >
              <option value="recent">Recently added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="hit-rate">Hit rate: High to Low</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9eb0c4]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-[#1d2836] bg-[#0c121a] px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#e6edf5]">
            No matching items found
          </p>
          <p className="mt-1 text-xs text-[#8899ad]">
            Try clearing your search query or switching the base filter back to All bases.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedBase('all');
            }}
            className="mt-4 inline-flex items-center rounded-lg border border-[#253548] bg-[#131c28] px-4 py-2 text-xs font-semibold text-[#e6edf5] transition-colors hover:bg-[#1a2636] cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Data Table View */
        <div className="overflow-hidden rounded-xl border border-[#1d2836] bg-[#0c121a]">
          <div className="max-h-[540px] overflow-x-auto overflow-y-auto">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead className="sticky top-0 z-10 border-b border-[#192331] bg-[#0d141e]">
                <tr className="text-xs font-semibold text-[#9aa9bc]">
                  <th scope="col" className="py-3.5 pl-4 pr-3 font-semibold">
                    Item
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-semibold">
                    Base
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-semibold">
                    Brand
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-semibold">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-semibold">
                    Location
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151e2b]">
                {filteredItems.map((item) => {
                  const isSaved = savedIds.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-[#101823]"
                    >
                      {/* Item Column */}
                      <td className="py-3.5 pl-4 pr-3">
                        <div className="flex items-center gap-3.5">
                          <CardThumbnail theme={item.theme} type={item.type} />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-bold tracking-wide text-[#f2f6fb] uppercase">
                              {item.title}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[#8b9cb0] tabular-nums">
                              <span>{item.score.toLocaleString()}</span>
                              <Award
                                className="h-3.5 w-3.5 text-[#7aa2e3] shrink-0"
                                aria-hidden="true"
                              />
                              <span>
                                {item.regionLabel}({item.hitRate}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Base */}
                      <td className="px-3 py-3.5 font-mono text-xs text-[#cad5e3] tabular-nums">
                        {item.base}
                      </td>

                      {/* Brand */}
                      <td className="px-3 py-3.5 text-xs font-medium text-[#cad5e3]">
                        {item.brand}
                      </td>

                      {/* Type */}
                      <td className="px-3 py-3.5 text-xs font-medium text-[#cad5e3]">
                        {item.type}
                      </td>

                      {/* Location */}
                      <td className="px-3 py-3.5 text-xs text-[#cad5e3] whitespace-nowrap">
                        {item.location}
                      </td>

                      {/* Price */}
                      <td className="px-3 py-3.5 text-base font-extrabold text-[#f5f8fc] tabular-nums whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 pl-3 pr-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onBuyItem(item)}
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#7ee2b8] px-3.5 text-xs font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Buy now
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleSave(item)}
                            aria-pressed={isSaved}
                            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee2b8] whitespace-nowrap shrink-0 cursor-pointer ${
                              isSaved
                                ? 'border-[#2d6656] bg-[#102621] text-[#7ee2b8]'
                                : 'border-[#253346] bg-[#101824] text-[#e4ecf5] hover:border-[#394d66] hover:bg-[#152030]'
                            }`}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                isSaved ? 'fill-[#7ee2b8] text-[#7ee2b8]' : ''
                              }`}
                              aria-hidden="true"
                            />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const isSaved = savedIds.has(item.id);
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-[#1d2836] bg-[#0c121a] p-4 transition-colors hover:border-[#2a3b50]"
              >
                <div>
                  <CardThumbnail theme={item.theme} type={item.type} size="lg" />

                  <h2 className="mt-3.5 text-sm font-bold tracking-wide text-[#f2f6fb] uppercase">
                    {item.title}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8b9cb0] tabular-nums">
                    <span>{item.score.toLocaleString()}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>
                      {item.regionLabel}({item.hitRate}%)
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-y-2 border-t border-[#16202c] pt-3 text-xs">
                    <div>
                      <dt className="text-[#72849a]">Base</dt>
                      <dd className="mt-0.5 font-mono text-[#d8e2ee] tabular-nums">
                        {item.base}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#72849a]">Location</dt>
                      <dd className="mt-0.5 text-[#d8e2ee]">{item.location}</dd>
                    </div>
                    <div>
                      <dt className="text-[#72849a]">Brand</dt>
                      <dd className="mt-0.5 text-[#d8e2ee]">{item.brand}</dd>
                    </div>
                    <div>
                      <dt className="text-[#72849a]">Type</dt>
                      <dd className="mt-0.5 text-[#d8e2ee]">{item.type}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#16202c] pt-3.5">
                  <span className="text-lg font-extrabold text-[#f5f8fc] tabular-nums">
                    ${item.price.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleSave(item)}
                      aria-pressed={isSaved}
                      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isSaved
                          ? 'border-[#2d6656] bg-[#102621] text-[#7ee2b8]'
                          : 'border-[#253346] bg-[#101824] text-[#e4ecf5] hover:border-[#394d66]'
                      }`}
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${
                          isSaved ? 'fill-[#7ee2b8] text-[#7ee2b8]' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onBuyItem(item)}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-[#7ee2b8] px-3.5 text-xs font-bold text-[#071018] transition-colors hover:bg-[#95ecc7] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Buy now
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
