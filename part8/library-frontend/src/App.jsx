import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommend from "./components/Recommend";
import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client/react";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("logged-user-to-library");
    setToken(token);
  }, []);
  const des = {
    padding: 5,
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem("logged-user-to-library");
    client.resetStore();
    navigate("/");
  };

  return (
    <div>
      <div>
        <Link to="/authors" style={des}>
          <button>authors</button>
        </Link>
        <Link to="/books" style={des}>
          <button>books</button>
        </Link>
        {!token && (
          <>
            <Link to="/login" style={des}>
              <button>login</button>
            </Link>
          </>
        )}
        {token && (
          <>
            <Link to="/addBook" style={des}>
              <button>add book</button>
            </Link>

            <Link to="/recommend" style={des}>
              <button>recommend</button>
            </Link>
            <button onClick={logout}>log out</button>
          </>
        )}
      </div>

      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/addBook" element={<NewBook />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
