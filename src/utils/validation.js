/**
 * Validates the Admin Login form fields.
 * Returns an object mapping field names to error messages.
 */
export function validateLoginForm(values) {
  const errors = {};
  const email = (values.email || '').trim();
  const password = values.password || '';

  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

/**
 * Validates Add Book and Edit Book form fields.
 * Returns an object mapping field names to error messages.
 */
export function validateBookForm(values) {
  const errors = {};
  const currentYear = new Date().getFullYear();

  const title = (values.title || '').trim();
  const author = (values.author || '').trim();
  const isbn = (values.isbn || '').trim();
  const category = (values.category || '').trim();
  const shelfLocation = (values.shelfLocation || '').trim();
  const yearNum = Number(values.publishedYear);
  const totalCopiesNum = Number(values.totalCopies);
  const availableCopiesNum = Number(values.availableCopies);

  if (!title) {
    errors.title = 'Book title is required.';
  } else if (title.length < 2) {
    errors.title = 'Book title must be at least 2 characters.';
  }

  if (!author) {
    errors.author = 'Author name is required.';
  } else if (author.length < 2) {
    errors.author = 'Author name must be at least 2 characters.';
  }

  if (!isbn) {
    errors.isbn = 'ISBN is required.';
  } else {
    const cleanedIsbn = isbn.replace(/[-\s]/g, '');
    if (!/^(?:\d{10}|\d{13}|\d{9}[\dX])$/i.test(cleanedIsbn)) {
      errors.isbn = 'Enter a valid 10-digit or 13-digit ISBN.';
    }
  }

  if (!category) {
    errors.category = 'Please select a category.';
  }

  if (values.publishedYear === '' || values.publishedYear === null || values.publishedYear === undefined) {
    errors.publishedYear = 'Published year is required.';
  } else if (!Number.isInteger(yearNum) || yearNum < 1450 || yearNum > currentYear) {
    errors.publishedYear = `Enter a valid year between 1450 and ${currentYear}.`;
  }

  if (values.totalCopies === '' || values.totalCopies === null || values.totalCopies === undefined) {
    errors.totalCopies = 'Total copies is required.';
  } else if (!Number.isInteger(totalCopiesNum) || totalCopiesNum < 1) {
    errors.totalCopies = 'Total copies must be at least 1.';
  } else if (totalCopiesNum > 500) {
    errors.totalCopies = 'Total copies cannot exceed 500.';
  }

  if (values.availableCopies === '' || values.availableCopies === null || values.availableCopies === undefined) {
    errors.availableCopies = 'Available copies is required.';
  } else if (!Number.isInteger(availableCopiesNum) || availableCopiesNum < 0) {
    errors.availableCopies = 'Available copies cannot be negative.';
  } else if (!errors.totalCopies && availableCopiesNum > totalCopiesNum) {
    errors.availableCopies = 'Available copies cannot exceed total copies.';
  }

  if (!shelfLocation) {
    errors.shelfLocation = 'Shelf location is required (e.g., CS-204).';
  } else if (shelfLocation.length < 2 || shelfLocation.length > 16) {
    errors.shelfLocation = 'Shelf location must be 2 to 16 characters.';
  }

  return errors;
}
