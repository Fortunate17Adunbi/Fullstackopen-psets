import { createContext, useContext, useReducer } from "react";

export const AppContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      action.payload;
    case "REMOVE_USER":
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

const AppContextProvider = (props) => {
  const [user, dispatchUser] = useReducer(userReducer, null);

  return (
    <AppContext.Provider value={[user, dispatchUser]}>
      {props.children}
    </AppContext.Provider>
  );
};

// export const userData =

export default AppContextProvider;
