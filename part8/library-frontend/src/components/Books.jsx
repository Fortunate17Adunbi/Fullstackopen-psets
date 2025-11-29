import { useQuery } from "@apollo/client/react";
import { FIND_BOOK } from "../queries";
import { useState } from "react";
import BookTable from "./BookTable";

const Books = () => {
  const [genreToShow, setGenreToShow] = useState(null);
  const filtered = useQuery(FIND_BOOK, {
    variables: { genre: genreToShow },
    fetchPolicy: "cache-and-network",
  });

  const genres = [
    "refactoring",
    "agile",
    "patterns",
    "design",
    "classic",
    "crime",
    "revolution",
  ];

  if (filtered.loading) {
    return <div>loading...</div>;
  }
  console.log("to show", genreToShow);
  console.log("filtered  ", filtered);
  const books = filtered.data ? filtered.data.allBooks : [];

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{genreToShow}</strong>
      </p>
      <BookTable books={books} />
      <div>
        {genres.map((genre) => (
          <button onClick={() => setGenreToShow(genre)} key={genre}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenreToShow(null)}>all genre</button>
      </div>
    </div>
  );
};

export default Books;
