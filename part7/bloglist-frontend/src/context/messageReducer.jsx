const messageReducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS":
      return action.payload;
    case "ERROR":
      return action.payload;
    case "REMOVE":
      return null;
    default:
      return state;
  }
};

export const setSuccess = (content) => {
  return {
    type: "SUCCESS",
    payload: {
      type: "success",
      data: content,
    },
  };
};
export const setError = (content) => {
  return {
    type: "ERROR",
    payload: {
      type: "error",
      data: content,
    },
  };
};
export const setRemove = (content) => {
  return {
    type: "REMOVE",
  };
};
export default messageReducer;
