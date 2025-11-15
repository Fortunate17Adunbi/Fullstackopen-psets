import { Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const App = () => {
  const des = {
    padding: 5,
  };
  return (
    <div>
      <div>
        <Link to="/authors" style={des}>
          authors
        </Link>
        <Link to="/books" style={des}>
          books
        </Link>
        <Link to="/addBook" style={des}>
          add book
        </Link>
      </div>

      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/addBook" element={<NewBook />} />
      </Routes>
    </div>
  );
};

export default App;
