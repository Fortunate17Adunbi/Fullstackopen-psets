import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { USER, FIND_BOOK } from "../queries";
import BookTable from "./BookTable";

const Recommend = () => {
  const userRes = useQuery(USER);
  const [genreToShow, setGenreToShow] = useState(null);
  const filtered = useQuery(FIND_BOOK, {
    variables: { genre: genreToShow },
    skip: !genreToShow,
  });

  useEffect(() => {
    if (userRes.data) {
      setGenreToShow(userRes.data.me.favoriteGenre);
    }
  }, [userRes.data]);

  if (filtered.loading || userRes.loading) {
    return <div>loading...</div>;
  }
  console.log("genres to s ", genreToShow);
  const books = genreToShow ? filtered.data.allBooks : [];

  return (
    <>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{genreToShow}</strong>
      </p>
      <BookTable books={books} />
    </>
  );
};

export default Recommend;
