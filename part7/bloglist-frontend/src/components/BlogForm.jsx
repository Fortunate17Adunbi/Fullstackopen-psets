import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useMessage } from "../context/useMessage";

const BlogForm = ({ blogFormRef }) => {
  const queryClient = useQueryClient();
  const message = useMessage();
  const [blogField, setBlogField] = useState({
    title: "",
    author: "",
    url: "",
  });

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (createdBlog) => {
      queryClient.setQueryData(["blogs"], (prevBlog) =>
        prevBlog.concat(createdBlog)
      );
      message.success(
        `a new blog '${createdBlog.title}' by '${createdBlog.author}' added`
      );
      blogFormRef.current.toggleVisibility();
      setBlogField({ title: "", author: "", url: "" });
    },
    onError: (error) => {
      message.error(error.response.data.error);
    },
  });
  const addBlog = (event) => {
    event.preventDefault();
    newBlogMutation.mutate(blogField);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input
              type="text"
              value={blogField.title}
              placeholder="enter title"
              onChange={({ target }) =>
                setBlogField((late) => ({ ...late, title: target.value }))
              }
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={blogField.author}
              placeholder="enter author"
              onChange={({ target }) =>
                setBlogField((late) => ({ ...late, author: target.value }))
              }
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={blogField.url}
              placeholder="enter url"
              onChange={({ target }) =>
                setBlogField((late) => ({ ...late, url: target.value }))
              }
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
