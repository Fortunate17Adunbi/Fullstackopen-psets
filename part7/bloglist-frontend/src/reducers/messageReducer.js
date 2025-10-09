import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: null,
  reducers: {
    setSuccess(state, action) {
      return {
        type: "success",
        data: action.payload,
      };
    },
    setError(state, action) {
      return {
        type: "error",
        data: action.payload,
      };
    },
    removeMessage() {
      return null;
    },
  },
});

export const { setSuccess, setError, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
