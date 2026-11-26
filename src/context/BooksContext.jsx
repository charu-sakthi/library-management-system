import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  createBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from '../services/bookApi.js';

const BooksContext = createContext(null);

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    action: 'added',
    title: 'Designing Data-Intensive Applications',
    detail: 'Registered 6 copies in Computer Science (CS-204)',
    actor: 'Claire Bennett',
    timestamp: '18 mins ago',
  },
  {
    id: 2,
    action: 'issued',
    title: 'Effective Java',
    detail: 'All 5 copies currently checked out',
    actor: 'Circulation Desk',
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    action: 'updated',
    title: 'The Design of Everyday Things',
    detail: 'Updated shelf location to DES-091',
    actor: 'Claire Bennett',
    timestamp: '3 hours ago',
  },
  {
    id: 4,
    action: 'returned',
    title: 'Thinking, Fast and Slow',
    detail: '2 copies returned to Economics shelf',
    actor: 'Circulation Desk',
    timestamp: 'Yesterday',
  },
];

let nextActivityId = INITIAL_ACTIVITIES.length + 1;

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const logActivity = useCallback((entry) => {
    setActivities((prev) => [
      {
        id: nextActivityId++,
        timestamp: 'Just now',
        actor: 'Claire Bennett',
        ...entry,
      },
      ...prev.slice(0, 7),
    ]);
  }, []);

  const refreshBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Unable to load books from the catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  async function addBook(bookData) {
    const created = await createBook(bookData);
    setBooks((prev) => [created, ...prev]);
    logActivity({
      action: 'added',
      title: created.title,
      detail: `Added ${created.totalCopies} ${
        created.totalCopies === 1 ? 'copy' : 'copies'
      } in ${created.category}`,
    });
    return created;
  }

  async function editBook(id, bookData) {
    const updated = await updateBook(id, bookData);
    setBooks((prev) =>
      prev.map((book) => (book.id === updated.id ? updated : book))
    );
    logActivity({
      action: 'updated',
      title: updated.title,
      detail: `Updated inventory (${updated.availableCopies} of ${updated.totalCopies} available)`,
    });
    return updated;
  }

  async function removeBook(id) {
    const numericId = Number(id);
    const targetBook = books.find((b) => b.id === numericId);
    await deleteBook(numericId);
    setBooks((prev) => prev.filter((book) => book.id !== numericId));
    if (targetBook) {
      logActivity({
        action: 'deleted',
        title: targetBook.title,
        detail: `Removed from ${targetBook.category} catalog`,
      });
    }
  }

  const totalBookTitles = books.length;
  const availableBookTitles = books.filter(
    (book) => book.availableCopies > 0
  ).length;
  const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableCopies = books.reduce(
    (sum, book) => sum + book.availableCopies,
    0
  );
  const checkedOutCopies = Math.max(0, totalCopies - availableCopies);
  const totalCategories = new Set(books.map((book) => book.category)).size;

  const value = {
    books,
    activities,
    loading,
    error,
    refreshBooks,
    addBook,
    editBook,
    removeBook,
    stats: {
      totalBookTitles,
      availableBookTitles,
      totalCopies,
      availableCopies,
      checkedOutCopies,
      totalCategories,
    },
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used inside a BooksProvider.');
  }
  return context;
}
