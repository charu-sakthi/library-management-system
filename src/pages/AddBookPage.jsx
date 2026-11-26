import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import BookForm from '../components/BookForm.jsx';
import { useBooks } from '../context/BooksContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AddBookPage() {
  const { addBook } = useBooks();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleCreateBook(values) {
    try {
      const created = await addBook(values);
      showToast({
        type: 'success',
        title: 'Book added',
        message: `"${created.title}" has been added to the catalog.`,
      });
      navigate('/books');
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Unable to add book',
        message: err.message || 'Please check the form fields and try again.',
      });
      throw err;
    }
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Manage Books', to: '/books' },
        { label: 'Add Book' },
      ]}
      showAddButton={false}
    >
      <div className="max-w-3xl space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Add New Book
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter bibliographic details and inventory quantity to register a
              new title.
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

        <BookForm
          submitLabel="Save Book"
          submittingLabel="Saving Book..."
          onSubmit={handleCreateBook}
          cancelTo="/books"
        />
      </div>
    </AdminLayout>
  );
}
