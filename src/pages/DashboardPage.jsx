import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookCheck,
  BookMarked,
  CheckCircle2,
  FolderKanban,
  Library,
  Pencil,
  PlusCircle,
  RotateCcw,
  Trash2,
  XCircle,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import StatCard from '../components/StatCard.jsx';
import { useBooks } from '../context/BooksContext.jsx';

function getActivityIcon(action) {
  switch (action) {
    case 'added':
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
        </span>
      );
    case 'updated':
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[#172554] shrink-0">
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </span>
      );
    case 'deleted':
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700 shrink-0">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </span>
      );
    case 'returned':
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-[#9a7222] shrink-0">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </span>
      );
    default:
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0">
          <BookMarked className="h-4 w-4" aria-hidden="true" />
        </span>
      );
  }
}

export default function DashboardPage() {
  const { books, activities, loading, error, stats } = useBooks();

  const recentBooks = useMemo(() => books.slice(0, 5), [books]);

  const categorySummary = useMemo(() => {
    const map = new Map();
    books.forEach((book) => {
      const current = map.get(book.category) || {
        category: book.category,
        titles: 0,
        available: 0,
        total: 0,
      };
      current.titles += 1;
      current.available += book.availableCopies;
      current.total += book.totalCopies;
      map.set(book.category, current);
    });
    return Array.from(map.values()).sort((a, b) => b.titles - a.titles);
  }, [books]);

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Library Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview of book inventory, circulation, and recent catalog
              activity.
            </p>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172554] hover:text-[#D4A853] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Manage All Books</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {/* Four Primary Statistics Cards */}
        <section
          aria-label="Library inventory metrics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="Total Books"
            value={loading ? '—' : stats.totalBookTitles}
            detail={`${stats.totalCopies} total copies in catalog`}
            icon={Library}
            accent="navy"
          />
          <StatCard
            label="Available Books"
            value={loading ? '—' : stats.availableBookTitles}
            detail={`${stats.availableCopies} copies ready on shelves`}
            icon={BookCheck}
            accent="gold"
          />
          <StatCard
            label="Issued Books"
            value={loading ? '—' : stats.checkedOutCopies}
            detail="Copies currently checked out"
            icon={BookMarked}
            accent="navy"
          />
          <StatCard
            label="Categories"
            value={loading ? '—' : stats.totalCategories}
            detail="Active subject classifications"
            icon={FolderKanban}
            accent="gold"
          />
        </section>

        {/* Recent Books + Recent Activity */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Recent Books */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200">
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Recent Books
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest titles added or updated in the collection
                </p>
              </div>
              <Link
                to="/books"
                className="text-xs font-medium text-[#172554] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <div className="p-5 space-y-3 animate-pulse">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-11 bg-slate-100 rounded-lg"
                  />
                ))}
              </div>
            ) : recentBooks.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-500">
                No books in the catalog yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-medium text-slate-500">
                      <th className="py-3 px-5 whitespace-nowrap">Title</th>
                      <th className="py-3 px-4 whitespace-nowrap">Category</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">
                        Quantity
                      </th>
                      <th className="py-3 px-5 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {recentBooks.map((book) => (
                      <tr
                        key={book.id}
                        className="hover:bg-slate-50/90 transition-colors"
                      >
                        <td className="py-3 px-5">
                          <Link
                            to={`/books/edit/${book.id}`}
                            className="font-medium text-slate-900 hover:text-[#172554] transition-colors block truncate max-w-[230px]"
                          >
                            {book.title}
                          </Link>
                          <span className="text-xs text-slate-500 block truncate max-w-[230px]">
                            {book.author}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
                          {book.category}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-slate-800 tabular-nums whitespace-nowrap">
                          {book.availableCopies} / {book.totalCopies}
                        </td>
                        <td className="py-3 px-5 whitespace-nowrap">
                          {book.availableCopies > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                              <CheckCircle2
                                className="h-3.5 w-3.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Available</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
                              <XCircle
                                className="h-3.5 w-3.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Issued Out</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="font-display text-base font-semibold text-slate-900">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Catalog updates and circulation events
              </p>
            </div>

            <ul className="divide-y divide-slate-100">
              {activities.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-slate-50/75 transition-colors"
                >
                  {getActivityIcon(item.action)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {item.detail}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {item.actor} · {item.timestamp}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Category Summary */}
        {!loading && categorySummary.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="font-display text-base font-semibold text-slate-900">
                Collection by Category
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inventory distribution across library subject sections
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-medium text-slate-500">
                    <th className="py-3 px-5 whitespace-nowrap">Category</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">
                      Titles
                    </th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">
                      Available Copies
                    </th>
                    <th className="py-3 px-5 text-right whitespace-nowrap">
                      Total Copies
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {categorySummary.map((row) => (
                    <tr
                      key={row.category}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-5 font-medium text-slate-900">
                        {row.category}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                        {row.titles}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-emerald-700 tabular-nums">
                        {row.available}
                      </td>
                      <td className="py-3 px-5 text-right font-mono text-xs text-slate-700 tabular-nums">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}
