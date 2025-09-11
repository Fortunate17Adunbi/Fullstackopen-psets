import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Blog />', () => {
  let container
  const mockLike = vi.fn()
  beforeEach(() => {
    const blog = {
      title: 'How to write test',
      author: 'Fullstackopen',
      url: 'https://fullstackopen.com/en/part5/testing_react_app',
      likes: 1
    }

    container = render(<Blog blog={blog} updateLike={mockLike} />).container
  })

  test('element with title, author visible initially', () => {
    const element = screen.getByText(`How to write test Fullstackopen`, { exact: false })
    expect(element).toBeVisible()
  })
  test('details of the blog is not blog initially visible', () => {
    const detailsDiv = container.querySelector('#blog-details')
    expect(detailsDiv).not.toBeVisible()
  })
  test('details of the blog is visible if set', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)
    screen.debug()
    const detailsDiv = container.querySelector('#blog-details')
  })
  test('clicking the like n-times calls the event handler n-times', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    screen.debug()

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})