import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useMessage } from "../context/useMessage";

import blogService from "../services/blogs";

const Blog = ({ blog, isCreator }) => {
  const [isShown, setIsShown] = useState(false);
  const queryClient = useQueryClient();
  const message = useMessage();

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, deleteBlogId) => {
      queryClient.setQueryData(["blogs"], (prevBlog) =>
        prevBlog.filter((b) => b.id !== deleteBlogId)
      );
      message.success(`deleted blog`);
    },
    onError: (error) => {
      message.error(error.response.data.error);
    },
  });
  const likeBlogMutation = useMutation({
    mutationFn: ({ id, toBeUpdated }) => blogService.update(id, toBeUpdated),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blogs"], (prevBlog) =>
        prevBlog.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog))
      );
      message.success(
        `Liked '${updatedBlog.title}' by '${updatedBlog.author}'`
      );
    },
    onError: (error) => {
      console.log("error", error);
      message.error(error.response.data.error);
    },
  });

  const deleteBlog = (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };
  const updateLike = (blog) => {
    const toBeUpdated = {
      ...blog,
      user: blog.user?.id ?? "",
      likes: blog.likes + 1,
    };
    likeBlogMutation.mutate({ id: blog.id, toBeUpdated });
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const buttonLabel = isShown ? "hide" : "show";
  const detialsStyle = { display: isShown ? "" : "none" };

  return (
    <div style={blogStyle} className="blog">
      <p>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setIsShown(!isShown)}>{buttonLabel}</button>
      </p>

      <div style={detialsStyle} id="blog-details">
        <p>{blog.url}</p>
        <p>
          Likes {blog.likes}{" "}
          <button onClick={() => updateLike(blog)}>like</button>
        </p>
        <p>{blog.author}</p>
        {isCreator && <button onClick={() => deleteBlog(blog)}>delete</button>}
      </div>
    </div>
  );
};

export default Blog;
