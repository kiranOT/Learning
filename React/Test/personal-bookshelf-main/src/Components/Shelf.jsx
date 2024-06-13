import React from 'react';

const Shelf = ({ savedBooks, onRemoveBook }) => {
  return (
    <div className="max-w-screen h-fit p-4">
      <h2 className="text-2xl font-bold mb-4">Saved Books</h2>
      {savedBooks.length === 0 ? (
        <p className="text-lg">No books saved.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-y-10 gap-x-6">
          {savedBooks.map((book) => (
            <div key={book.key} className="card bg-white shadow-md rounded-xl p-4">
              <h3 className="text-xl font-bold mb-2 truncate">{book.title}</h3>
              <p className="text-sm text-center text-black cursor-auto my-2 px-2 truncate">
                {book.author_name?.[0] || 'Unknown Author'}
              </p>
              <button
                onClick={() => onRemoveBook(book.key)}
                className="bg-red-500 text-white font-bold rounded p-2 hover:scale-105 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shelf;
