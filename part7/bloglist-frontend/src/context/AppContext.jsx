import { createContext, useContext, useReducer } from "react";

import messageReducer from "./messageReducer";
import userReducer from "./userReducer";

const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [message, dispatchMessage] = useReducer(messageReducer, null);
  const [user, dispatchUser] = useReducer(userReducer, null);

  const value = {
    message: [message, dispatchMessage],
    user: [user, dispatchUser],
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export const messageContext = () => {
  return useContext(AppContext).message;
};
export const messageContextData = () => {
  return useContext(AppContext).message[0];
};
export const messageContextDispatch = () => {
  return useContext(AppContext).message[1];
};

export const userContext = () => {
  return useContext(AppContext).user;
};
export const userContextData = () => {
  return userContext()[0];
};
export const userContextDispatch = () => {
  return userContext()[1];
};

export default AppContext;
