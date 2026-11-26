import { INITIAL_BOOKS } from '../data/initialBooks.js';
import { apiRequest, USE_MOCK_API } from './apiConfig.js';

/**
 * In-memory book store used when USE_MOCK_API is true.
 * Resets cleanly on page refresh and avoids using localStorage as a database.
 */
let inMemoryBooks = INITIAL_BOOKS.map((book) => ({ ...book }));
let nextBookId = Math.max(...inMemoryBooks.map((book) => book.id), 0) + 1;

const simulateNetworkDelay = (ms = 160) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all books in the library catalog.
 * Spring Boot endpoint: GET /api/books
 */
export async function getAllBooks() {
  if (!USE_MOCK_API) {
    return apiRequest('/books');
  }

  await simulateNetworkDelay();
  return inMemoryBooks.map((book) => ({ ...book }));
}

/**
 * Fetch a single book by ID.
 * Spring Boot endpoint: GET /api/books/{id}
 */
export async function getBookById(id) {
  if (!USE_MOCK_API) {
    return apiRequest(`/books/${id}`);
  }

  await simulateNetworkDelay(120);
  const numericId = Number(id);
  const found = inMemoryBooks.find((book) => book.id === numericId);
  if (!found) {
    throw new Error(`Book with ID ${id} was not found.`);
  }
  return { ...found };
}

/**
 * Search books by title or author.
 * Spring Boot endpoint: GET /api/books/search?query=...
 */
export async function searchBooks(query) {
  if (!USE_MOCK_API) {
    const encoded = encodeURIComponent(query.trim());
    return apiRequest(`/books/search?query=${encoded}`);
  }

  await simulateNetworkDelay(120);
  const term = query.trim().toLowerCase();
  if (!term) {
    return inMemoryBooks.map((book) => ({ ...book }));
  }

  return inMemoryBooks
    .filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
    )
    .map((book) => ({ ...book }));
}

/**
 * Add a new book to the catalog.
 * Spring Boot endpoint: POST /api/books
 */
export async function createBook(bookData) {
  const payload = {
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn.trim(),
    category: bookData.category.trim(),
    publishedYear: Number(bookData.publishedYear),
    totalCopies: Number(bookData.totalCopies),
    availableCopies: Number(bookData.availableCopies),
    shelfLocation: bookData.shelfLocation.trim().toUpperCase(),
  };

  if (!USE_MOCK_API) {
    return apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  await simulateNetworkDelay(200);
  const newBook = {
    id: nextBookId++,
    ...payload,
  };
  inMemoryBooks = [newBook, ...inMemoryBooks];
  return { ...newBook };
}

/**
 * Update an existing book record.
 * Spring Boot endpoint: PUT /api/books/{id}
 */
export async function updateBook(id, bookData) {
  const payload = {
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn.trim(),
    category: bookData.category.trim(),
    publishedYear: Number(bookData.publishedYear),
    totalCopies: Number(bookData.totalCopies),
    availableCopies: Number(bookData.availableCopies),
    shelfLocation: bookData.shelfLocation.trim().toUpperCase(),
  };

  if (!USE_MOCK_API) {
    return apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  await simulateNetworkDelay(200);
  const numericId = Number(id);
  const index = inMemoryBooks.findIndex((book) => book.id === numericId);
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
  return { ...updated };
}

/**
 * Delete a book record by ID.
 * Spring Boot endpoint: DELETE /api/books/{id}
 */
export async function deleteBook(id) {
  if (!USE_MOCK_API) {
    return apiRequest(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  await simulateNetworkDelay(160);
  const numericId = Number(id);
  const exists = inMemoryBooks.some((book) => book.id === numericId);
  if (!exists) {
    throw new Error(`Book with ID ${id} was not found.`);
  }

  inMemoryBooks = inMemoryBooks.filter((book) => book.id !== numericId);
  return { deletedId: numericId };
}
