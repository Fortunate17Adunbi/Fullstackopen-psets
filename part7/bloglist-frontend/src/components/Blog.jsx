import { startTransition } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useMessage } from "../context/useMessage";
import { useMatch, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import blogService from "../services/blogs";
import Comment from "./Comment";

const Blog = () => {
  const queryClient = useQueryClient();
  const message = useMessage();
  const blogs = queryClient.getQueryData(["blogs"]);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");
  const [blog] = match
    ? blogs.filter((blog) => blog.id === match.params.id)
    : [];

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, deleteBlogId) => {
      queryClient.setQueryData(["blogs"], (prevBlog) =>
        prevBlog.filter((b) => b.id !== deleteBlogId)
      );
      startTransition(() => {
        navigate("/");
        message.success(`deleted blog`);
      });
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
  const commentMutation = useMutation({
    mutationFn: ({ id, contentObj }) => blogService.comment(id, contentObj),
    onSuccess: (returnedBlog) => {
      console.log("returned Blog", returnedBlog);
      queryClient.setQueryData(["blogs"], (prevBlog) =>
        prevBlog.map((b) => (b.id === returnedBlog.id ? returnedBlog : b))
      );
      message.success(`added comment to ${returnedBlog.author}'s blog`);
    },
    onError: (error) => {
      message.error(error.response?.data.error);
    },
  });

  const deleteBlog = (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };
  const updateLike = (blog) => {
    console.log("blog in update oo", blog);
    const toBeUpdated = {
      ...blog,
      user: blog.user?.id ?? "",
      likes: blog.likes + 1,
      comments: blog.comments?.map((c) => c.id),
    };
    console.log("tobe up in update oo", toBeUpdated);
    likeBlogMutation.mutate({ id: blog.id, toBeUpdated });
  };
  const handleComment = (id, contentObj) => {
    commentMutation.mutate({ id, contentObj });
  };

  console.log("blog ", blog);

  if (!blog) {
    return <div>blog does not exist</div>;
  }

  return (
    <div className="blog">
      <h3>
        {blog.title} {blog.author}
      </h3>

      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} Likes
        <Button onClick={() => updateLike(blog)} variant="outline-success">
          like
        </Button>
      </p>
      <p>added by {blog.user?.name}</p>
      <Button onClick={() => deleteBlog(blog)} variant="outline-danger">
        delete
      </Button>

      <Comment blog={blog} handleComment={handleComment} />
    </div>
  );
};

export default Blog;
