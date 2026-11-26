import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import BookTable from '../components/BookTable.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useBooks } from '../context/BooksContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ManageBooksPage() {
  const { books, loading, error, removeBook } = useBooks();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'all' || book.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && book.availableCopies > 0) ||
        (availabilityFilter === 'unavailable' && book.availableCopies === 0);

      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [books, searchQuery, availabilityFilter, categoryFilter]);

  async function handleConfirmDelete() {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      const deletedTitle = bookToDelete.title;
      await removeBook(bookToDelete.id);
      setBookToDelete(null);
      showToast({
        type: 'success',
        title: 'Book deleted',
        message: `"${deletedTitle}" has been removed from the catalog.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Delete failed',
        message: err.message || 'Unable to delete the selected book.',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminLayout
      breadcrumbs={[{ label: 'Manage Books' }]}
      showAddButton={false}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Manage Books
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter, update, or remove books across your library
              inventory.
            </p>
          </div>

          <Link
            to="/books/add"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#172554] hover:bg-[#1e316b] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
            <span>Add New Book</span>
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

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="tabular-nums">
            Showing {filteredBooks.length} of {books.length} books
          </span>
          {(searchQuery ||
            availabilityFilter !== 'all' ||
            categoryFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setAvailabilityFilter('all');
                setCategoryFilter('all');
              }}
              className="font-medium text-[#172554] hover:text-[#D4A853] transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        <BookTable
          books={filteredBooks}
          loading={loading}
          onDeleteRequest={(book) => setBookToDelete(book)}
        />
      </div>

      <ConfirmModal
        isOpen={Boolean(bookToDelete)}
        title="Delete book record?"
        message={
          bookToDelete
            ? `Are you sure you want to delete "${bookToDelete.title}" by ${bookToDelete.author}? This will remove all ${bookToDelete.totalCopies} copy records from the catalog.`
            : ''
        }
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDelete(null)}
      />
    </AdminLayout>
  );
}
