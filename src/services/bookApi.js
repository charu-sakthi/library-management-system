
import { INITIAL_BOOKS } from '../data/initialBooks.js';
import { apiRequest, USE_MOCK_API } from './apiConfig.js';

/**
 * In-memory store for mock mode.
 */
let inMemoryBooks = INITIAL_BOOKS.map((book) => ({ ...book }));
let nextBookId =
  Math.max(...inMemoryBooks.map((book) => book.id), 0) + 1;

const simulateNetworkDelay = (ms = 160) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Convert backend book fields into the frontend format.
 */
function normalizeBook(book) {
  return {
    ...book,
    totalCopies: book.quantity,
    availableCopies: book.availableQuantity,
  };
}

/**
 * Convert frontend form data into backend fields.
 */
function createPayload(bookData) {
  const quantity = Number(
    bookData.totalCopies ?? bookData.quantity ?? 0
  );

  return {
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn.trim(),
    category: bookData.category.trim(),
    quantity,
    availableQuantity: Number(
      bookData.availableCopies ?? quantity
    ),
  };
}

/**
 * Fetch all books.
 */
export async function getAllBooks() {
  if (!USE_MOCK_API) {
    const books = await apiRequest('/books');
    return books.map(normalizeBook);
  }

  await simulateNetworkDelay();
  return inMemoryBooks.map((book) => ({ ...book }));
}

/**
 * Fetch one book by ID.
 */
export async function getBookById(id) {
  if (!USE_MOCK_API) {
    const book = await apiRequest(`/books/${id}`);
    return normalizeBook(book);
  }

  await simulateNetworkDelay(120);

  const found = inMemoryBooks.find(
    (book) => book.id === Number(id)
  );

  if (!found) {
    throw new Error(`Book with ID ${id} was not found.`);
  }

  return { ...found };
}

/**
 * Search books by title or author.
 */
export async function searchBooks(query) {
  const books = await getAllBooks();
  const term = query.trim().toLowerCase();

  if (!term) {
    return books;
  }

  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
  );
}

/**
 * Add a new book.
 */
export async function createBook(bookData) {
  const payload = createPayload(bookData);

  if (!USE_MOCK_API) {
    const book = await apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return normalizeBook(book);
  }

  await simulateNetworkDelay(200);

  const newBook = {
    id: nextBookId++,
    ...payload,
  };

  inMemoryBooks = [newBook, ...inMemoryBooks];

  return normalizeBook(newBook);
}

/**
 * Update an existing book.
 */
export async function updateBook(id, bookData) {
  const payload = createPayload(bookData);

  if (!USE_MOCK_API) {
    const book = await apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return normalizeBook(book);
  }

  await simulateNetworkDelay(200);

  const numericId = Number(id);

  const index = inMemoryBooks.findIndex(
    (book) => book.id === numericId
  );

  if (index === -1) {
    throw new Error(`Book with ID ${id} was not found.`);
  }

  const updated = {
    id: numericId,
    ...payload,
  };

  inMemoryBooks = inMemoryBooks.map((book) =>
    book.id === numericId ? updated : book
  );

  return normalizeBook(updated);
}

/**
 * Delete a book by ID.
 */
export async function deleteBook(id) {
  if (!USE_MOCK_API) {
    return apiRequest(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  await simulateNetworkDelay(160);

  const numericId = Number(id);

  const exists = inMemoryBooks.some(
    (book) => book.id === numericId
  );

  if (!exists) {
    throw new Error(`Book with ID ${id} was not found.`);
  }

  inMemoryBooks = inMemoryBooks.filter(
    (book) => book.id !== numericId
  );

  return { deletedId: numericId };
}
