const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  console.log('blogs ', blogs)
  response.json(blogs)
})
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  console.log('end user ', user)
  await user.save()
  response.status(201).json(savedBlog)
})
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user
  const toBeDeleted =  await Blog.findById(id)
  if (!toBeDeleted) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (!toBeDeleted.user || toBeDeleted.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Not the creator of blog' })
  }

  await Blog.findByIdAndDelete(id)

  response.status(204).end()
})
blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body
  const id = request.params.id
  const user = request.user

  const blogToUpdate = await Blog.findById(id)
  if (!blogToUpdate) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if(!blogToUpdate.user || blogToUpdate.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Not the creator of blog' })
  }

  const updatedNote = await Blog.findByIdAndUpdate(
    id, body, { new: true, runValidators: true, context: 'query' }
  )
  response.status(200).json(updatedNote)
})


module.exports = blogsRouter