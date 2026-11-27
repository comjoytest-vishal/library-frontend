
import api from "./axios";

// GET: Fetch all books with search, class filter and pagination
export const getBooks = (params = {}) => {
    return api.get("/books", { params });
};

// GET: Fetch a single book by ID
export const getBookById = (id) => {
    return api.get(`/books/${id}`);
};

// POST: Create a new book
export const createBook = (data) => {
    return api.post("/books", data);
};

// PUT: Update an existing book
export const updateBook = (id, data) => {
    return api.put(`/books/${id}`, data);
};

// DELETE: Delete a book
export const deleteBook = (id) => {
    return api.delete(`/books/${id}`);
};

// GET: Fetch total books count
export const getBooksCount = () => {
    return api.get("/books/count");
};
