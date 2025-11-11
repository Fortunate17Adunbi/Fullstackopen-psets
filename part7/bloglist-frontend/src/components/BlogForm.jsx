import { useState } from "react";
import { Button, Form } from "react-bootstrap";
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
      <h4>create new</h4>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            type="text"
            value={blogField.title}
            placeholder="Enter blog's title"
            onChange={({ target }) =>
              setBlogField((late) => ({ ...late, title: target.value }))
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author</Form.Label>
          <Form.Control
            type="text"
            value={blogField.author}
            placeholder="Enter blog's author"
            onChange={({ target }) =>
              setBlogField((late) => ({ ...late, author: target.value }))
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url</Form.Label>

          <Form.Control
            type="text"
            value={blogField.url}
            placeholder="Enter blog's url"
            onChange={({ target }) =>
              setBlogField((late) => ({ ...late, url: target.value }))
            }
          />
        </Form.Group>
        <Button type="submit" variant="outline-success">
          create
        </Button>
      </Form>
    </>
  );
};

export default BlogForm;
