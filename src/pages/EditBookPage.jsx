import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import BookForm from '../components/BookForm.jsx';
import { useBooks } from '../context/BooksContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getBookById } from '../services/bookApi.js';

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editBook } = useBooks();
  const { showToast } = useToast();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchBook() {
      setLoading(true);
      setLoadError('');
      try {
        const record = await getBookById(id);
        if (active) {
          setBook(record);
        }
      } catch (err) {
        if (active) {
          setLoadError(err.message || 'Unable to find the requested book.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchBook();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleUpdateBook(values) {
    try {
      const updated = await editBook(id, values);
      showToast({
        type: 'success',
        title: 'Changes saved',
        message: `"${updated.title}" has been updated.`,
      });
      navigate('/books');
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update failed',
        message: err.message || 'Unable to update this book.',
      });
      throw err;
    }
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Manage Books', to: '/books' },
        { label: 'Edit Book' },
      ]}
      showAddButton={false}
    >
      <div className="max-w-3xl space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Edit Book
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update catalog details, quantity, or shelf placement.
            </p>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#172554] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Books</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 animate-pulse">
            <div className="h-11 bg-slate-100 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="h-11 bg-slate-100 rounded-lg" />
              <div className="h-11 bg-slate-100 rounded-lg" />
              <div className="h-11 bg-slate-100 rounded-lg" />
              <div className="h-11 bg-slate-100 rounded-lg" />
            </div>
          </div>
        ) : loadError ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Book Not Found
              </h2>
              <p className="mt-1 text-sm text-slate-600">{loadError}</p>
            </div>
            <Link
              to="/books"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#172554] hover:bg-[#1e316b] rounded-lg transition-colors"
            >
              Return to Manage Books
            </Link>
          </div>
        ) : (
          <BookForm
            initialValues={book}
            submitLabel="Save Changes"
            submittingLabel="Saving Changes..."
            onSubmit={handleUpdateBook}
            cancelTo="/books"
          />
        )}
      </div>
    </AdminLayout>
  );
}
