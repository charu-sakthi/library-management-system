import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { BOOK_CATEGORIES } from '../data/initialBooks.js';
import { validateBookForm } from '../utils/validation.js';

const DEFAULT_VALUES = {
  title: '',
  author: '',
  isbn: '',
  category: BOOK_CATEGORIES[0],
  publishedYear: String(new Date().getFullYear()),
  totalCopies: '1',
  availableCopies: '1',
  shelfLocation: '',
};

export default function BookForm({
  initialValues,
  submitLabel = 'Save Book',
  submittingLabel = 'Saving...',
  onSubmit,
  cancelTo = '/books',
}) {
  const isCreateMode = !initialValues;

  const [values, setValues] = useState(() => ({
    ...DEFAULT_VALUES,
    ...(initialValues
      ? {
          title: initialValues.title ?? '',
          author: initialValues.author ?? '',
          isbn: initialValues.isbn ?? '',
          category: initialValues.category ?? BOOK_CATEGORIES[0],
          publishedYear: String(initialValues.publishedYear ?? ''),
          totalCopies: String(initialValues.totalCopies ?? ''),
          availableCopies: String(initialValues.availableCopies ?? ''),
          shelfLocation: initialValues.shelfLocation ?? '',
        }
      : {}),
  }));

  const [availableEdited, setAvailableEdited] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field, nextValue) {
    setValues((prev) => {
      const updated = {
        ...prev,
        [field]: nextValue,
      };
      if (isCreateMode && field === 'totalCopies' && !availableEdited) {
        updated.availableCopies = nextValue;
      }
      return updated;
    });

    if (field === 'availableCopies') {
      setAvailableEdited(true);
    }

    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        if (isCreateMode && field === 'totalCopies' && !availableEdited) {
          delete copy.availableCopies;
        }
        return copy;
      });
    }
    if (submitError) {
      setSubmitError('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateBookForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(err.message || 'Unable to save book. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden"
    >
      <div className="p-6 sm:p-8 space-y-8">
        {submitError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800"
          >
            <AlertCircle
              className="h-4 w-4 mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span>{submitError}</span>
          </div>
        )}

        {/* Section 1: Bibliographic Details */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Book Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Core catalog information used for search and indexing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="book-title"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Book Title
              </label>
              <input
                id="book-title"
                type="text"
                value={values.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Designing Data-Intensive Applications"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'book-title-error' : undefined}
                className={`w-full h-11 px-3.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.title
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              />
              {errors.title && (
                <p
                  id="book-title-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="book-author"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Author
              </label>
              <input
                id="book-author"
                type="text"
                value={values.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="e.g., Martin Kleppmann"
                aria-invalid={Boolean(errors.author)}
                aria-describedby={
                  errors.author ? 'book-author-error' : undefined
                }
                className={`w-full h-11 px-3.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.author
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              />
              {errors.author && (
                <p
                  id="book-author-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.author}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="book-isbn"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                ISBN
              </label>
              <input
                id="book-isbn"
                type="text"
                value={values.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                placeholder="978-1-4493-7332-0"
                aria-invalid={Boolean(errors.isbn)}
                aria-describedby={errors.isbn ? 'book-isbn-error' : undefined}
                className={`w-full h-11 px-3.5 text-sm font-mono bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 transition-colors ${
                  errors.isbn
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              />
              {errors.isbn && (
                <p id="book-isbn-error" className="mt-1.5 text-xs text-red-600">
                  {errors.isbn}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="book-category"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Category
              </label>
              <select
                id="book-category"
                value={values.category}
                onChange={(e) => handleChange('category', e.target.value)}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={
                  errors.category ? 'book-category-error' : undefined
                }
                className={`w-full h-11 px-3.5 text-sm bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  errors.category
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              >
                {BOOK_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p
                  id="book-category-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="book-year"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Published Year
              </label>
              <input
                id="book-year"
                type="number"
                min="1450"
                max={new Date().getFullYear()}
                value={values.publishedYear}
                onChange={(e) => handleChange('publishedYear', e.target.value)}
                aria-invalid={Boolean(errors.publishedYear)}
                aria-describedby={
                  errors.publishedYear ? 'book-year-error' : undefined
                }
                className={`w-full h-11 px-3.5 text-sm font-mono tabular-nums bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  errors.publishedYear
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              />
              {errors.publishedYear && (
                <p id="book-year-error" className="mt-1.5 text-xs text-red-600">
                  {errors.publishedYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Inventory & Quantity */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Inventory & Shelf Placement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set total quantity, available copies, and library shelf code.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="book-total-copies"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Quantity (Total Copies)
              </label>
              <input
                id="book-total-copies"
                type="number"
                min="1"
                max="500"
                value={values.totalCopies}
                onChange={(e) => handleChange('totalCopies', e.target.value)}
                aria-invalid={Boolean(errors.totalCopies)}
                aria-describedby={
                  errors.totalCopies ? 'book-total-error' : undefined
                }
                className={`w-full h-11 px-3.5 text-sm font-mono tabular-nums bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  errors.totalCopies
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              />
              {errors.totalCopies && (
                <p
                  id="book-total-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.totalCopies}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="book-available-copies"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Available Copies
              </label>
              <input
                id="book-available-copies"
                type="number"
                min="0"
                max="500"
                value={values.availableCopies}
                onChange={(e) =>
                  handleChange('availableCopies', e.target.value)
                }
                aria-invalid={Boolean(errors.availableCopies)}
                aria-describedby={
                  errors.availableCopies ? 'book-available-error' : undefined
                }
                className={`w-full h-11 px-3.5 text-sm font-mono tabular-nums bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  errors.availableCopies
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              />
              {errors.availableCopies && (
                <p
                  id="book-available-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.availableCopies}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="book-shelf"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Shelf Location
              </label>
              <input
                id="book-shelf"
                type="text"
                value={values.shelfLocation}
                onChange={(e) => handleChange('shelfLocation', e.target.value)}
                placeholder="e.g., CS-204"
                aria-invalid={Boolean(errors.shelfLocation)}
                aria-describedby={
                  errors.shelfLocation ? 'book-shelf-error' : undefined
                }
                className={`w-full h-11 px-3.5 text-sm font-mono uppercase bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 transition-colors ${
                  errors.shelfLocation
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                }`}
              />
              {errors.shelfLocation && (
                <p
                  id="book-shelf-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.shelfLocation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 px-6 py-4 sm:px-8 bg-slate-50/75 border-t border-slate-200">
        <Link
          to={cancelTo}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-[#172554] hover:bg-[#1e316b] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] focus-visible:ring-offset-2"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
