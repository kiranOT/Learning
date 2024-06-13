import React, { useEffect, useState, lazy, Suspense } from "react";
import { Riple } from "react-loading-indicators";
import "./App.css";

const Navbar = lazy(() => import("./Components/Navbar"));
const Cards = lazy(() => import("./Components/Cards"));
const Shelf = lazy(() => import("./Components/Shelf"));

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState("");
  const [savedBooks, setSavedBooks] = useState([]);

  // Load saved books from localStorage when the component mounts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedBooks"));
    console.log("Loaded saved books:", saved);
    if (saved.length > 0) {
      setSavedBooks(saved);
    }
  }, []);

  const handleSaveBook = (book) => {
    setSavedBooks((prevSavedBooks) => [...prevSavedBooks, book]);
    localStorage.setItem("savedBooks", JSON.stringify(savedBooks));
  };

  const handleRemoveBook = (bookKey) => {
    setSavedBooks((prevSavedBooks) =>
      prevSavedBooks.filter((book) => book.key !== bookKey)
    );
  };

  return (
    <div className="App bg-[#FFFFFF] dark:bg-slate-800 dark:text-white">
      <Suspense
        fallback={
          <div>
            <Riple color="#000000" size="large" text="" textColor="" />
          </div>
        }
      >
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          setResults={setResults}
        />
        <Cards
          results={results}
          onSaveBook={handleSaveBook}
          onRemoveBook={handleRemoveBook}
          savedBooks={savedBooks}
        />
        <Shelf savedBooks={savedBooks} onRemoveBook={handleRemoveBook} />
      </Suspense>
    </div>
  );
}

export default App;
