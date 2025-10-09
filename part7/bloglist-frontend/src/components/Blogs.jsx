import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import blogService from "../services/blogs";

import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import Blog from "./Blog";
import { userContextData } from "../context/AppContext";
import { useAuth } from "../context/useAuth";

const Blogs = () => {
  const user = userContextData();
  const blogFormRef = useRef();
  const auth = useAuth();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  const blogs = result.data;
  console.log("blogs", blogs);

  const logOut = () => {
    auth.logOut();
  };
  const blogForm = () => {
    return (
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
    );
  };
  const sortedBlog = blogs.toSorted((a, b) => b.likes - a.likes);
  return (
    <div>
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} is logged in{" "}
          <button onClick={logOut}>log out</button>{" "}
        </p>
        {blogForm()}
        {sortedBlog.map((blog) => {
          const isCreator = blog.user?.username === user.username;
          return <Blog key={blog.id} blog={blog} isCreator={isCreator} />;
        })}
      </div>
    </div>
  );
};

export default Blogs;
