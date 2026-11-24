
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookEntry from "./components/BookEntry";
import StudentEntry from "./components/StudentEntry";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/book-entry" element={<BookEntry />} />
        <Route path="/student-entry" element={<StudentEntry />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
