import { useState } from 'react'

const Blog = ({ blog, updateLike, deleteBlog }) => {
  const [isShown, setIsShown] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonLabel = isShown ? 'hide' : 'show'
  const detialsStyle = { display: isShown ? '' : 'none' }

  return (
  <div style={blogStyle}>
    <p>{blog.title} {blog.author} <button onClick={() => setIsShown(!isShown)}>{buttonLabel}</button></p>
    
    <div style={detialsStyle} id='blog-details'>
      <p>{blog.url}</p>
      <p>Likes {blog.likes} <button onClick={() => updateLike(blog)}>like</button></p>
      <p>{blog.author}</p>
      <button onClick={() => deleteBlog(blog)}>delete</button>
    </div>
  </div>
  )  
}

export default Blog