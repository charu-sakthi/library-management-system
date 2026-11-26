import { Search, X } from 'lucide-react';
import { BOOK_CATEGORIES } from '../data/initialBooks.js';

const AVAILABILITY_FILTERS = [
  { id: 'all', label: 'All Books' },
  { id: 'available', label: 'Available' },
  { id: 'unavailable', label: 'Issued Out' },
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  availabilityFilter,
  onAvailabilityChange,
  categoryFilter,
  onCategoryChange,
  showFilters = true,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by book title or author..."
          aria-label="Search books by title or author"
          className="w-full h-10 pl-10 pr-9 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#172554] focus:ring-2 focus:ring-[#172554]/15 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-3">
          {onCategoryChange && (
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              aria-label="Filter by category"
              className="h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#172554] focus:ring-2 focus:ring-[#172554]/15 transition-colors"
            >
              <option value="all">All Categories</option>
              {BOOK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          {onAvailabilityChange && (
            <div
              className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg"
              role="group"
              aria-label="Filter by availability"
            >
              {AVAILABILITY_FILTERS.map((option) => {
                const active = availabilityFilter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onAvailabilityChange(option.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] ${
                      active
                        ? 'bg-[#172554] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
