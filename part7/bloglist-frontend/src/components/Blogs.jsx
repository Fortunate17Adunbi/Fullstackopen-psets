import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Route, Routes, useMatch, useLocation } from "react-router-dom";
import _ from "lodash";
import { Button, Navbar, Nav, Container } from "react-bootstrap";

import blogService from "../services/blogs";

import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import Blog from "./Blog";
import Users from "./Users";
import User from "./User";
import { userContextData } from "../context/AppContext";
import { useAuth } from "../context/useAuth";

const Blogs = () => {
  const user = userContextData();
  const blogFormRef = useRef();
  const auth = useAuth();
  const location = useLocation();
  const match = useMatch("/users/:id");

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading && !result.data) {
    return <div>loading data...</div>;
  }
  const blogs = result.data;
  console.log("blogs", blogs);

  const userBlogs = match
    ? blogs.filter((blog) => blog.user?.id === match.params.id)
    : null;
  console.log("user blogs", userBlogs);
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
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const listBlog = (blogs) => {
    return (
      <>
        {/* {blogs.map((blog) => {
          const isCreator = blog.user?.username === user.username;
          return <Blog key={blog.id} blog={blog} isCreator={isCreator} />;
        })} */}
        {blogs.map((blog) => (
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
        {blogForm()}
      </>
    );
  };
  const aStyle = {
    padding: 5,
    textDecoration: 0,
  };
  const sortedBlog = blogs.toSorted((a, b) => b.likes - a.likes);
  return (
    <div>
      <div>
        <Navbar collapseOnSelect expand="lg">
          <Navbar.Toggle aria-controls="responsive-navbar" />
          <Navbar.Collapse id="responsive-navbar">
            <Nav
              defaultActiveKey={location.pathname}
              className="w-100 justify-content-around"
              variant="underline"
            >
              <Nav.Link eventKey="/" as="span">
                <Link to="/" style={aStyle}>
                  blogs
                </Link>
              </Nav.Link>

              <Nav.Link eventKey="/users" as="span">
                <Link to="/users" style={aStyle}>
                  users
                </Link>
              </Nav.Link>

              <Nav.Link disabled>
                <em>{user.name} is logged in</em>
              </Nav.Link>
              <Nav.Item>
                <Button variant="outline-danger" onClick={logOut}>
                  log out
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <h2>Blogs</h2>

        <Routes>
          <Route path="/" element={listBlog(sortedBlog)} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User blogs={userBlogs} />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </div>
    </div>
  );
};

export default Blogs;
