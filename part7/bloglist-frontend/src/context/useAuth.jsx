import { useMessage } from "./useMessage";
import { setUser, removeUser, loginUser } from "./userReducer";
import { userContextDispatch } from "./AppContext";
import blogService from "../services/blogs";

export const useAuth = () => {
  const dispatchUser = userContextDispatch();
  const message = useMessage();
  const login = async (loginObject) => {
    try {
      const user = await loginUser(loginObject);
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatchUser(setUser(user));
      message.success(`'${user.name}' logged in successfully`);
    } catch (error) {
      message.error("Incorrect username or password");
    }
  };
  const initializeUser = () => {
    try {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        blogService.setToken(user.token);
        dispatchUser(setUser(user));
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
      window.localStorage.removeItem("loggedBlogUser");
      blogService.setToken(null);
    }
  };
  const logOut = () => {
    try {
      blogService.setToken(null);
      window.localStorage.removeItem("loggedBlogUser");
      dispatchUser(removeUser());
      message.success(`logged out ...`);
    } catch {
      blogService.setToken(null);
      dispatchUser(removeUser());
    }
  };

  return { login, initializeUser, logOut };
};
