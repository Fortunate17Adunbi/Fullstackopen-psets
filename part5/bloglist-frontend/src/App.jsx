import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

import loginService from './services/login'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({
    success: null,
    error: null
  })

  const blogFormRef = useRef()
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (loginObject) => {
    console.log(`loggin in with username: ${loginObject.username} password: ${loginObject.password}`)

    try {
      const user = await loginService.login(loginObject)
      console.log('user ', user)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage(late => ({ 
        ...late, success: `${user.name} logged in successfully`
      }))
      setTimeout(() => {
        setMessage({ success: null, error: null })
      }, 5000)
    } catch {
      console.log('Incorrect username or password')
      setMessage(late => ({ ...late, error: 'Incorrect username or password' }))
      setTimeout(() => {
        setMessage({ success: null, error: null })
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    )
  }

  const removeBlog = async (blog) => {      
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)){
      try {
        await blogService.remove(blog.id)
        setBlogs(late => (late.filter(b => b.id !== blog.id)))
        setMessage(late => ({ 
          ...late, 
          success: `successfully removed ${blog.title}`
        }))
        setTimeout(() => {
          setMessage({ success: null, error: null })
        }, 5000) 
      } catch (error) {
        console.log('unable to remove blog')
        // console.log('error', error)
        setMessage(late => ({ ...late, error: `${error.response.data.error} - ${blog.title}` }))
        setTimeout(() => {
          setMessage({ success: null, error: null })
        }, 5000)      
      } 
    }
  }

  const updateLike = async (blogObject) => {
    console.log('to be update blog ', blogObject)
    const toBeUpdated = {
      user: blogObject.user?.id ?? '',
      likes: blogObject.likes + 1,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url,
    }
    try {
      const updatedBlog = await blogService.update(blogObject.id, toBeUpdated)
      console.log('updated blog ', updatedBlog)
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b ))
      setMessage(late => ({ 
        ...late, 
        success: `Liked ${updatedBlog.title} by ${updatedBlog.author}`
      }))
      setTimeout(() => {
        setMessage({ success: null, error: null })
      }, 5000)   
    } catch(error) {
      console.log('unable to update Like')
      console.log('error', error)
      setMessage(late => ({ ...late, error: error.response.data.error }))
      setTimeout(() => {
        setMessage({ success: null, error: null })
      }, 5000)      
    }
  }

  const addBlog = async (blogObject) => {
    console.log(`title: ${blogObject.title}, author: ${blogObject.author}, url: ${blogObject.url}`)
    try {
      blogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blogObject)
      setBlogs(late => (late.concat(createdBlog)))
      setMessage(late => ({ 
        ...late, 
        success: `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      }))
      setTimeout(() => {
        setMessage({ success: null, error: null })
      }, 5000)
    } catch {
      console.log('unable to create blog')
      setMessage(late => ({ ...late, error: 'unable to create blog' }))
      setTimeout(() => {
        setMessage({ success: null, error: null })
      }, 5000)
    }
  }
  const blogForm = () => {
    return (
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setMessage(late => ({ ...late, success: 'logged out ...' }))
    setTimeout(() => {
      setMessage({ success: null, error: null })
    }, 5000)
    setUser(null)
  }

  // sorted blog
  const sortedBlog =  blogs.toSorted((a, b) => b.likes - a.likes)
  console.log('sorted blog ', sortedBlog)
  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user.name} is logged in <button onClick={logOut}>log out</button> </p>
          {blogForm()}
          {sortedBlog.map(blog =>
            <Blog key={blog.id} blog={blog} updateLike={updateLike} deleteBlog={removeBlog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App