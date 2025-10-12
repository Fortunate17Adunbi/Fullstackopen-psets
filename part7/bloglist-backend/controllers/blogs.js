const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate([
    { path: "user", select: { username: 1, name: 1 } },
    { path: "comments", select: { content: 1 } },
  ]);
  // const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  // console.log("blogs ", JSON.stringify(blogs, null, 2));
  response.json(blogs);
});
blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  console.log("end user ", user);
  await user.save();
  // edited
  const savedPopulation = await savedBlog.populate("user", {
    username: 1,
    name: 1,
  });
  response.status(201).json(savedPopulation);
});
blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const user = request.user;
  const toBeDeleted = await Blog.findById(id);
  if (!toBeDeleted) {
    return response.status(404).json({ error: "blog not found" });
  }
  if (
    !toBeDeleted.user ||
    toBeDeleted.user.toString() !== user._id.toString()
  ) {
    return response.status(403).json({ error: "Not the creator of blog" });
  }

  await Blog.findByIdAndDelete(id);

  response.status(204).end();
});
blogsRouter.put("/:id/like", userExtractor, async (request, response) => {
  console.log("or here");
  const body = request.body;
  const id = request.params.id;
  const user = request.user;

  console.log("body ", body);
  console.log("type oof id ", typeof id);
  const blogToUpdate = await Blog.findById(id);
  console.log("blog to update ", blogToUpdate);
  if (!blogToUpdate) {
    return response.status(404).json({ error: "Blog not found" });
  }
  // console.log('1')
  if (
    !blogToUpdate.user ||
    blogToUpdate.user.toString() !== user._id.toString()
  ) {
    console.log("not creator");
    return response.status(403).json({ error: "Not the creator of blog" });
  }
  console.log("232");
  const updatedNote = await Blog.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: "query",
  }).populate([
    { path: "user", select: { username: 1, name: 1 } },
    { path: "comments", select: { content: 1 } },
  ]);

  console.log("updated ", updatedNote);
  response.status(200).json(updatedNote);
});
blogsRouter.post("/:id/comments", userExtractor, async (request, response) => {
  console.log("here");
  const body = request.body;
  const id = request.params.id;

  if (!body.content) {
    return response.status(400).json({ error: "Content is required" });
  }
  let blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).json({ error: "Blog does not exist" });
  }
  const newComment = new Comment({
    content: body.content,
    blogID: blog._id,
  });

  const savedComment = await newComment.save();
  const updatedBlog = await Blog.findByIdAndUpdate(
    blog._id,
    { $addToSet: { comments: savedComment._id } },
    { new: true, runValidators: true, context: "query" }
  ).populate([
    { path: "user", select: { username: 1, name: 1 } },
    { path: "comments", select: { content: 1 } },
  ]);
  return response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
