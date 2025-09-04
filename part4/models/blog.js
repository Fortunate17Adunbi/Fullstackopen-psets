const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minLength: 3
  },
  author: String,
  url: {
    type: String,
    required: [true, 'Url is required']
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

mongoose.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
