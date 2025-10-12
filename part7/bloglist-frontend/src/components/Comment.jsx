import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const Comment = ({ blog, handleComment }) => {
  const [content, setContent] = useState("");

  console.log("comment blog", blog);
  const commentToShow = () => {
    if (!blog.comments.length) {
      return <h4>No comment yet...</h4>;
    }
    console.log();
    return (
      <ul>
        {blog.comments.map((comment) => (
          // console.log("map blog", comment)
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    );
  };

  const addComment = (event) => {
    event.preventDefault();
    handleComment(blog.id, { content });
    setContent("");
  };
  return (
    <>
      <h3>comments</h3>
      <div>
        <Form onSubmit={addComment}>
          <Form.Group>
            <Form.Control
              type="text"
              value={content}
              onChange={({ target }) => setContent(target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="outline-secondary">
            add comment
          </Button>
        </Form>
      </div>
      <div>{commentToShow()}</div>
    </>
  );
};

export default Comment;
