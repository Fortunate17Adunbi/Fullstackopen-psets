import blogService from "../services/blogs";
import loginService from "../services/login";

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "REMOVE_USER":
      return null;
    default:
      return null;
  }
};

export const setUser = (tokenObj) => {
  return {
    type: "SET_USER",
    payload: tokenObj,
  };
};
export const removeUser = () => {
  return {
    type: "REMOVE_USER",
  };
};
export const loginUser = async (loginObject) => {
  const user = await loginService.login(loginObject);
  window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
  blogService.setToken(user.token);
  return user;
};

export default userReducer;
