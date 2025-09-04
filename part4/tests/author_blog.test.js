const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelpers = require('../utils/list_helpers')

describe('author details for ', () => {
  test('most blog', () => {
    const result = listHelpers.mostBlog(listHelpers.blogs)
    console.log('result ', result)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 3 })
  })
  test('most likes', () => {
    const result = listHelpers.mostLikes(listHelpers.blogs)
    console.log('result ', result)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 22 })
  })
})