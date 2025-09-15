const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, deleteBlog, showDetails, blogLike } = require('./helper')

describe('Blog list app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users/', {
      data: {
        username: 'root',
        name: 'admin',
        password: 'secret'
      }
    })
    await request.post('/api/users/', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    const headerElement = page.getByText('log in to application')
    const formElement = page.locator('form')

    await expect(headerElement).toBeVisible()
    await expect(formElement).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'secret')

      await expect(page.locator('.success')).toBeVisible()
      await expect(page.locator('.success')).toContainText('admin logged in successfully')

    })
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'otu')

      await expect(page.locator('.error')).toBeVisible()
      await expect(page.locator('.error')).toContainText('Incorrect username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 
        'TDD harms architecture', 'Robert C. Martin', 
        'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
      )
      const blogDiv = page.locator('.blog')
      console.log('blog div', blogDiv)
      await expect(blogDiv.getByText('TDD harms architecture')).toBeVisible()
    })

    describe('and at least a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 
          'TDD harms architecture', 'Robert C. Martin', 
          'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
        )
        await createBlog(page, 
          'Type wars', 'Robert C. Martin', 
          'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
        )
      })

      test('a blog can be liked', async ({ page }) => {
        const blogDetails = await blogLike(page, 'Type wars', 1)
        const likeButton = blogDetails.getByRole('button', { name: 'like' })
        console.log('blog detail ', blogDetails)
        await expect(likeButton.locator('..')).toContainText('1')
      })
      test('blog can be deleted by the creator by confirming', async ({ page }) => {
        page.on('dialog', async dialog => {
          console.log('win you confirm')
          return await dialog.accept()
        })
        const blogDetails = await deleteBlog(page, 'Type wars')
        console.log('blog detailing ', blogDetails)
        await expect(blogDetails).toHaveCount(0)
      })

      describe('login to another user', () => {
        beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'log out' }).click()

          await loginWith(page, 'mluukkai', 'salainen')
          await createBlog(page, 
            'Writing right tests with playwright', 'anonymous', 
            'http://localhost:5173'
          )
        })

        test('and see button if its the creator of blog', async ({ page }) => {
          const blogDetails = await showDetails(page, 'Writing right tests with playwright')
          await expect(blogDetails.getByRole('button', { name: 'delete' })).toBeVisible()
        })
        test('and cannot see button if its not the creator of blog', async ({ page }) => {
          const blogDetails = await showDetails(page, 'Type wars')

          await expect(blogDetails.getByRole('button', { name: 'delete' })).not.toBeVisible()
        })
      })

      test('blog is sorted by likes', async ({ page }) => {
        await createBlog(page, 
          'Writing right tests with playwright', 'anonymous', 
          'http://localhost:5173'
        )
        
        let blogDetails = await blogLike(page, 'Writing right tests with playwright', 3)
        let likeElement = blogDetails.getByText('Likes')
        await expect(likeElement).toContainText('3')     
 

        blogDetails = await blogLike(page, 'TDD harms architecture', 1)
        likeElement = blogDetails.getByText('Likes')
        await expect(likeElement).toContainText('1') 

        blogDetails = await blogLike(page, 'Type wars', 2)
        likeElement = blogDetails.getByText('Likes')
        await expect(likeElement).toContainText('2') 
        
        const allBlog = await page.locator('.blog').all()

        await expect(allBlog[0]).toContainText('Writing right tests with playwright')
        await expect(allBlog[1]).toContainText('Type wars')
        await expect(allBlog[2]).toContainText('TDD harms architecture')
      })
    })
  })
})