import { createSlice } from "@reduxjs/toolkit";

import blogService from "../services/blogs";
import loginService from "../services/login";

import { setSuccess, setError, removeMessage } from "./messageReducer";
import {
  messageContextDispatch,
  userContextDispatch,
} from "../context/AppContext";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    removeUser() {
      return null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export const initializeUser = () => {
  return async (dispatch) => {
    try {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        console.log("user in reducer ", user);
        blogService.setToken(user.token);
        dispatch(setUser(user));
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
      window.localStorage.removeItem("loggedBlogUser");
      blogService.setToken(null);
    }
  };
};
export const login = async (loginObject) => {
  try {
    console.log("in here");
    const user = await loginService.login(loginObject);
    console.log("user ", user);
    window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
    blogService.setToken(user.token);
    userContextDispatch(setUser(user));
    messageContextDispatch(setSuccess(`'${user.name}' logged in successfully`));
    setTimeout(() => {
      messageContextDispatch(removeMessage());
    }, 5000);
  } catch (error) {
    messageContextDispatch(setError("Incorrect username or password"));
    setTimeout(() => {
      messageContextDispatch(removeMessage());
    }, 5000);
  }
};
export const logOutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    dispatch(removeUser());
    dispatch(setSuccess(`logged out ...`));
    setTimeout(() => {
      dispatch(removeMessage());
    }, 5000);
  };
};
export default userSlice.reducer;
