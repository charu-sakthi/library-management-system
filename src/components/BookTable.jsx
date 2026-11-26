import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react';

function renderAvailabilityStatus(book) {
  if (book.availableCopies === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
        <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Issued Out</span>
      </span>
    );
  }

  if (book.availableCopies === 1) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Low Stock</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Available</span>
    </span>
  );
}

export default function BookTable({
  books,
  loading,
  onDeleteRequest,
  emptyTitle = 'No books match your search',
  emptyDescription = 'Try adjusting your search keywords or add a new book to the catalog.',
  showActions = true,
}) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-500">
                <th className="py-3.5 px-4 whitespace-nowrap">Book & Author</th>
                <th className="py-3.5 px-4 whitespace-nowrap">ISBN</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Shelf</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">
                  Quantity
                </th>
                <th className="py-3.5 px-4 whitespace-nowrap">Availability</th>
                {showActions && (
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-48 bg-slate-200 rounded" />
                    <div className="mt-1.5 h-3 w-32 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-28 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-24 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-14 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="ml-auto h-3.5 w-10 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-20 bg-slate-100 rounded" />
                  </td>
                  {showActions && (
                    <td className="py-3.5 px-4">
                      <div className="ml-auto h-8 w-20 bg-slate-100 rounded" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-14 text-center shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#172554] text-[#D4A853]">
          <BookOpen className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
          {emptyTitle}
        </h3>
        <p className="mt-1.5 mx-auto max-w-md text-sm text-slate-500">
          {emptyDescription}
        </p>
        <div className="mt-5">
          <Link
            to="/books/add"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#172554] hover:bg-[#1e316b] rounded-lg transition-colors whitespace-nowrap"
          >
            Add New Book
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-500">
              <th className="py-3.5 px-4 whitespace-nowrap">Book & Author</th>
              <th className="py-3.5 px-4 whitespace-nowrap">ISBN</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Shelf</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">
                Quantity
              </th>
              <th className="py-3.5 px-4 whitespace-nowrap">Availability</th>
              {showActions && (
                <th className="py-3.5 px-4 text-right whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {books.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-slate-50/90 transition-colors duration-100"
              >
                <td className="py-3.5 px-4 min-w-[220px]">
                  <p className="font-medium text-slate-900 leading-snug">
                    {book.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {book.author}
                    {book.publishedYear ? ` · ${book.publishedYear}` : ''}
                  </p>
                </td>

                <td className="py-3.5 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                  {book.isbn}
                </td>

                <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                  {book.category}
                </td>

                <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {book.shelfLocation}
                </td>

                <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-900 tabular-nums whitespace-nowrap">
                  <span className="font-semibold">{book.availableCopies}</span>
                  <span className="text-slate-400"> / {book.totalCopies}</span>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {renderAvailabilityStatus(book)}
                </td>

                {showActions && (
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-2">
                      <Link
                        to={`/books/edit/${book.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#172554] bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554]"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(book)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
