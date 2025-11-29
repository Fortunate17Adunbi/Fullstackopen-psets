import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log("login error ", error.errors);
      setError(error.errors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("logged-user-to-library", token);
      navigate("/authors");
    }
  }, [result.data]);

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });

    setPassword("");
    setUsername("");
  };

  return (
    <form onSubmit={submit}>
      <div>
        username:
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:
        <input
          value={password}
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type="submit">login</button>
    </form>
  );
};

export default Login;
