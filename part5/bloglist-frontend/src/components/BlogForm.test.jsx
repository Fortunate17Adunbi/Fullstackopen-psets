import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('event handler gets called with user\'s input', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={mockCreateBlog} />)

    const titileInput = screen.getByPlaceholderText('enter title')
    const authorInput = screen.getByPlaceholderText('enter author')
    const urlInput = screen.getByPlaceholderText('enter url')
    const createButton = screen.getByText('create')

    await user.type(titileInput, 'Writing blog from test')
    await user.type(authorInput, 'Programmer&Tester')
    await user.type(urlInput, 'http://localhost:5173/')

    await user.click(createButton)
    // console.log('mock calls',mockCreateBlog.mock.calls)
    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    
    expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual({ 
      title: 'Writing blog from test',
      author: 'Programmer&Tester',
      url: 'http://localhost:5173/'
    })
  })
})