
import api from "./axios";

// GET: Fetch all students with search, class filter and pagination
export const getStudents = (params = {}) => {
    return api.get("/students", { params });
};

// GET: Fetch a single student by ID
export const getStudentById = (id) => {
    return api.get(`/students/${id}`);
};

// POST: Create a new student
export const createStudent = (data) => {
    return api.post("/students", data);
};

// PUT: Update an existing student
export const updateStudent = (id, data) => {
    return api.put(`/students/${id}`, data);
};

// DELETE: Delete a student
export const deleteStudent = (id) => {
    return api.delete(`/students/${id}`);
};

// GET: Fetch total students count
export const getStudentsCount = () => {
    return api.get("/students/count");
};
