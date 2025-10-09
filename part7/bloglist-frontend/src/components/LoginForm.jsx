import { useState } from "react";
import { useAuth } from "../context/useAuth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  const handleLogin = (loginObject) => {
    console.log(
      `loggin in with username: ${loginObject.username} password: ${loginObject.password}`
    );
    auth.login(loginObject);
  };

  const loginWith = (event) => {
    event.preventDefault();
    handleLogin({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={loginWith}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="text"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
