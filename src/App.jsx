
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookEntry from "./components/BookEntry";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/book-entry" element={<BookEntry />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
