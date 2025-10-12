import { useEffect } from "react";

import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";

import { userContextData } from "./context/AppContext";
import { useAuth } from "./context/useAuth";

const App = () => {
  const user = userContextData();
  const { initializeUser } = useAuth();

  useEffect(() => {
    initializeUser();
  }, []);
  console.log("how many");

  return (
    <div className="container">
      <Notification data-testid="notification" />
      {!user && <LoginForm />}
      {user && <Blogs />}
    </div>
  );
};

export default App;
