const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helpers')
const app = require('../app')
const Blog = require ('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token
describe('When there is initially blog saved ', () => {
  beforeEach(async () => {
    // create a user
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const newUser = new User({
      username: 'root',
      name: 'admin',
      passwordHash
    })
    await newUser.save()

    // login in to get user
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    token = response.body.token

    await Blog.deleteMany()
    // create blog for user
    const blog = helper.initialBlog.map((b, i) => {
      return i === 1
        ? { ...b, user: newUser._id }
        : { ...b }
    })
    await Blog.insertMany(blog)

  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('returned blog is formatted', async () => {
    const result = await api.get('/api/blogs')
    // console.log('result ', result.body)
    const blog = result.body[0]

    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
  test('a blog can be created', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Canonical string reduction'))

  })
  test('a blog without token will not store', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    assert(response.body.error.includes('Invalid token or missing'))
  })
  test('a blog without the like property defaults value to 0', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // console.log('result ', result.body)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Canonical string reduction'))

    assert.strictEqual(result.body.likes, 0)
  })
  test('a blog missing title cannot be added', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
  test('a blog missing url cannot be added', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
  test('a blog missing url and/or title cannot be added', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
  test('a blog can be deleted by creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const toBeDeleted = blogsAtStart[1]

    await api
      .delete(`/api/blogs/${toBeDeleted.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const title = blogsAtEnd.map(b => b.title)
    assert(!title.includes(toBeDeleted.title))
  })
  test('a blog cannot be deleted if user not authorized', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const toBeDeleted = blogsAtStart[1]

    const result = await api
      .delete(`/api/blogs/${toBeDeleted.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert(result.body.error.includes('Invalid token or missing'))

  })
  test('a user cannot delete blog not created by it', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const toBeDeleted = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${toBeDeleted.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert(result.body.error.includes('Not the creator of blog'))

  })
  test('a delete of non-existing blog fails', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = await helper.invalidId()

    const result = await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert(result.body.error.includes('blog not found'))
  })
  test.only('a blog can be liked', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[1]

    blogToUpdate = { ...blogToUpdate, likes : blogToUpdate.likes + 1 }
    console.log('blog to update ', blogToUpdate)

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToUpdate)
      .expect(200)

    console.log('result ', result.body)
    assert.deepStrictEqual(result.body.likes, 1)
  })
  test.only('user who is not creator cannot like a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[0]

    blogToUpdate = { ...blogToUpdate, likes : blogToUpdate.likes + 1 }
    console.log('blog to update ', blogToUpdate)

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToUpdate)
      .expect(403)

    console.log('result ', result.body)
    assert(result.body.error.includes('Not the creator of blog'))
  })
  test.only('an unidentified user cannot like blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[1]

    blogToUpdate = { ...blogToUpdate, likes : blogToUpdate.likes + 1 }
    console.log('blog to update ', blogToUpdate)

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}/like`)
      .send(blogToUpdate)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.deepStrictEqual(blogsAtEnd, blogsAtStart)
    assert(result.body.error.includes('Invalid token or missing'))
  })

})

describe('when there is initially one user in the db', () => {
  beforeEach( async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const newUser = new User({
      username: 'root',
      name: 'admin',
      passwordHash
    })
    await newUser.save()
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('a valid user can be created', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const username = usersAtEnd.map(user => user.username)

    assert.strictEqual(usersAtEnd.length, userAtStart.length + 1)
    assert(username.includes('mluukkai'))
  })
  test('an existing username cannot be added', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, userAtStart.length)
  })
  test('a user without password cannot be addded', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Matti Luukkainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    console.log('result ', result.body)
    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, userAtStart.length)
    assert(result.body.error.includes('Password is required'))
  })
  test('a user without username cannot be addded', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    console.log('result ', result.body)
    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, userAtStart.length)
    assert(result.body.error.includes('Username is required'))
  })
})


after(async () => {
  await mongoose.connection.close()
})