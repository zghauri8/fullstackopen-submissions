import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls onCreate with correct data (5.16)', async () => {
  const onCreate = vi.fn()
  render(<BlogForm onCreate={onCreate} />)

  await userEvent.type(screen.getByLabelText(/title/i), 'Clean Code')
  await userEvent.type(screen.getByLabelText(/author/i), 'Robert C. Martin')
  await userEvent.type(screen.getByLabelText(/url/i), 'http://cleancoder.com')

  await userEvent.click(screen.getByText('create'))

  expect(onCreate).toHaveBeenCalledTimes(1)
  expect(onCreate.mock.calls[0][0]).toEqual({
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'http://cleancoder.com',
  })
})