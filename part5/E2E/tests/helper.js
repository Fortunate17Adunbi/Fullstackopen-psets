const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  
  await page.getByTestId('notification').waitFor({ state: 'visible', timeout: 10_000 })
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.locator('.blog').getByText(title).waitFor({ state: 'visible' });
}

const showDetails = async (page, title) => {
  const miniData = page.getByText(title)
  await miniData.getByRole('button', { name: 'show' }).click()
  return await miniData.locator('..')
}

const deleteBlog = async (page, title) => {
  const p = await page.locator('.blog').getByText(title)
  await p.getByRole('button', { name: 'show' }).click()

  const blogDiv = p.locator('..')
  await blogDiv.getByRole('button', { name: 'delete' }).click()

  return await blogDiv
}
const blogLike = async (page, title, times) => {
  const p = page.locator('.blog').getByText(title)
  await p.getByRole('button', { name: 'show' }).click()
  const blogDiv = p.locator('..')

  for ( let i = 0; i < times; i++) {
    await blogDiv.getByRole('button', { name: 'like' }).click()
    const likeP = blogDiv.getByRole('button', { name: 'like' }).locator('..')
    await likeP.getByText(`Likes ${i + 1}`).waitFor()
  }

  return await blogDiv
}

export { loginWith, createBlog, deleteBlog, showDetails, blogLike }