import { useState } from "react";
import { Form, Button } from "react-bootstrap";
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
      <Form onSubmit={loginWith}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="outline-success">
          login
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
