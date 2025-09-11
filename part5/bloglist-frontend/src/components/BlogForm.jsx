import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogField, setBlogField] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(blogField)
    setBlogField({ title: '', author: '', url: ''})
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input 
              type="text" value={blogField.title} placeholder='enter title'
              onChange={({ target }) => setBlogField(late => ({...late, title: target.value })) } 
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input 
              type="text" value={blogField.author} placeholder='enter author'
              onChange={({ target }) => setBlogField(late => ({...late, author: target.value })) } 
            />
          </label>            
        </div>
        <div>
          <label>
            url
            <input type="text" value={blogField.url} placeholder='enter url'
              onChange={({ target }) => setBlogField(late => ({...late, url: target.value })) } 
            />
          </label>            
        </div>
        <button type="submit">create</button>
      </form> 
    </>   
  )
}

export default BlogForm