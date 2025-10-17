
import React, { useEffect, useState } from 'react';
import API from './api';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get('books/')
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>📚 Book List</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title} - {book.author}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
