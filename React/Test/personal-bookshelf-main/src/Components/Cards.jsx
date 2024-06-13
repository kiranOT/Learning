import React, { useState, useEffect } from 'react';
import fallbackUrl from '../assets/img-404.jpg';
import { Riple } from 'react-loading-indicators';

const Cards = ({ results, onSaveBook, onRemoveBook, savedBooks }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isBookSaved = (bookKey) => {
    return savedBooks.some((book) => book.key === bookKey);
  };

  useEffect(() => {
    if (!results) return;

    const fetchBooks = async () => {
      setError(false);
      setIsLoading(true);

      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${results}&limit=10&page=1`
        );
        const data = await response.json();
        setBooks(data.docs);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [results]);

  return (
    <div className="max-w-screen h-fit">
      <div className="text-center p-10">
        <h1 className="font-bold text-4xl mb-4">Responsive Product Card Grid</h1>
        <h1 className="text-3xl">Tailwind CSS</h1>
      </div>

      {isLoading && (
        <div className="loading-screen max-w-screen h-full flex justify-center ">
          <Riple color="#000000" size="large" text="" textColor="" />
        </div>
      )}

      <section className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        {error && <div className="error-message">An error occurred while fetching books.</div>}
        {!isLoading && !error && (
          <>
            {books.map((book) => (
              <div key={book.key} className="w-fit bg-white shadow-md rounded-xl duration-700 hover:scale-105 hover:shadow-xl">
                {book.oclc ? (
                  <img
                    src={
                      Array.isArray(book.oclc || book.isbn)
                        ? `https://covers.openlibrary.org/b/oclc/${book.oclc[0] || book.isbn[0]}-L.jpg`
                        : `https://covers.openlibrary.org/b/oclc/${book.oclc || book.isbn}-L.jpg`
                    }
                    className="h-80 w-72 object-fit rounded-t-xl"
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = fallbackUrl;
                    }}
                  />
                ) : (
                  <img src={fallbackUrl} alt={book.title} className="h-80 w-72 object-cover rounded-t-xl" />
                )}
                <div className="px-4 py-2 w-72 h-full">
                  <p className="text-lg text-center font-bold truncate block capitalize">{book.title}</p>
                  <div className="flex flex-col items-center justify-evenly h-30 gap-2 px-2">
                    <p className="w-full text-sm text-center cursor-auto my-2 truncate block">
                      {book.author_name?.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600 cursor-auto">{book.publish_date?.[0]}</p>
                    {isBookSaved(book.key) ? (
                      <button
                        onClick={() => onRemoveBook(book.key)}
                        className="bg-sky-300 text-red-700 font-bold rounded w-[80%] p-2 hover:scale-105 transition-all"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => onSaveBook(book)}
                        className="bg-sky-700 text-white font-bold rounded w-[80%] p-2 hover:scale-105 transition-all duration-400 ease-in-out"
                      >
                        Add to Shelf
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default Cards;
