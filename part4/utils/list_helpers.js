const _ = require('lodash')

const blogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Dont do that',
    author: 'Newa Giroud',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 15,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Big Daddy',
    author: 'Anthony Raphel',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Alpha male',
    author: 'Sholex wixa',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 1,
    __v: 0
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const initialBlog = [
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
]

const dummy = () => {
  return 1
}

const totalLikes = (array) => {
  return array.length === 0
    ? 0
    : array.reduce((total, blog) => {
      total + blog.likes
    }, 0)
}

const favouriteBlog = (array) => {
  // return array.length === 0
  //   ? { message: 'No Blog Available' }
  //   : array.reduce((highest, blog) => {
  //     return highest.likes > blog.likes
  //       ? highest
  //       : { title: blog.title, author: blog.author, likes: blog.likes }

  //   }, { title: '', author: '', likes: 0 })

  if (array.length === 0) {
    return { message: 'No Blog Available' }
  }
  const highestLikes = Math.max(...array.map(b => b.likes))
  const favBlog = array.find(b => b.likes === highestLikes)

  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

// loop through the blog
// group by authour with values as the the blogs of each author
// modify collection to format we want to return
// use the max method passing the blogs field as paramter to return the the element with most blog

// FUNCTION mostBlog(blogs):

//     START lodash chain with blogs

//     GROUP blogs BY author
//         → creates an object: { authorName: [list of blogs] }

//     MAP each group (blogList, author):
//         → create object { author: author, blogs: length of blogList }

//     FIND the object with maximum blogs count

//     UNWRAP the final value (.value())

//     RETURN the result

const mostBlog = (blogs) => {
  const highestBlog = _.chain(blogs)
    .groupBy((blog) => {
      return blog.author
    })
    .map((authorBlogs, author) => {
      return {
        author,
        blogs: authorBlogs.length
      }
    })
    .maxBy((authorList) => {
      return authorList.blogs
    })
    .value()

  return highestBlog
}

const mostLikes = (blogs) => {
  const highestLikes = _.chain(blogs)
    .groupBy((blogs) => {
      return blogs.author
    })
    .map((authorBlogs, author) => {
      const authorLikes = authorBlogs.reduce((sum, blog) => sum + blog.likes, 0)
      return { author, likes: authorLikes }
    })
    .maxBy((author) => {
      return author.likes
    })
    .value()

  return highestLikes
}

module.exports = { dummy, totalLikes, favouriteBlog, blogs, mostBlog, mostLikes, initialBlog }