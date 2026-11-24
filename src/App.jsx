import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookEntry from "./components/BookEntry";
import StudentEntry from "./components/StudentEntry";
import BookRecords from "./components/BookRecords";
import BookStock from "./components/BookStock";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/book-entry" element={<BookEntry />} />
        <Route path="/student-entry" element={<StudentEntry />} />
        <Route path="/book-records" element={<BookRecords />} />
        <Route path="/book-stock" element={<BookStock />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;