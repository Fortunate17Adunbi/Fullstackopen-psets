import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setError, setSuccess, removeMessage } from "./messageReducer";

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      console.log("action ", action);
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const id = action.payload.id;
      console.log("payload ", action.payload);
      return state.map((b) => (b.id !== id ? b : action.payload));
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      console.log("blogs", blogs);
      dispatch(setBlogs(blogs));
    } catch {
      dispatch(setError("could not get blog"));
      setTimeout(() => {
        dispatch(removeMessage());
      }, 5000);
    }
  };
};
export const createBlog = (blogObject) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogService.create(blogObject);
      dispatch(appendBlog(createdBlog));
      // dispatch(
      //   setSuccess(
      //     `a new blog '${createdBlog.title}' by '${createdBlog.author}' added`
      //   )
      // );
      // setTimeout(() => {
      //   dispatch(removeMessage());
      // }, 5000);
    } catch (error) {
      // set error message in here
      // dispatch(setError("unable to create blog"));
      // setTimeout(() => {
      //   dispatch(removeMessage());
      // }, 5000);
    }
  };
};
export const blogUpdate = (id, toBeUpdated) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(id, toBeUpdated);
      dispatch(updateBlog(updatedBlog));
      // set success
      dispatch(
        setSuccess(`Liked '${updatedBlog.title}' by '${updatedBlog.author}'`)
      );
      setTimeout(() => {
        dispatch(removeMessage());
      }, 5000);
    } catch (error) {
      dispatch(setError(error.response.data.error));
      setTimeout(() => {
        dispatch(removeMessage());
      }, 5000);
    }
  };
};
export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id);
      dispatch(removeBlog(id));
      dispatch(setSuccess(`successfully removed blog`));
      setTimeout(() => {
        dispatch(removeMessage());
      }, 5000);
    } catch (error) {
      dispatch(setError(`${error.response.data.error}`));
      setTimeout(() => {
        dispatch(removeMessage());
      }, 5000);
    }
  };
};
export default blogSlice.reducer;
