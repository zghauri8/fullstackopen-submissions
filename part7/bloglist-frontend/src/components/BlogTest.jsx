import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const sample = {
  id: '1',
  title: 'The Joel Test',
  author: 'Joel Spolsky',
  url: 'https://example.com',
  likes: 0,
  user: { username: 'mluukkai', name: 'Matti Luukkainen', id: 'u1' },
}

test('renders title and author, not url/likes by default (5.13)', () => {
  render(<Blog blog={sample} onLike={() => {}} onRemove={() => {}} own={true} />)
  expect(screen.getByText(/The Joel Test/)).toBeInTheDocument()
  expect(screen.getByText(/Joel Spolsky/)).toBeInTheDocument()
  expect(screen.queryByText('https://example.com')).not.toBeInTheDocument()
  expect(screen.queryByText(/likes/)).not.toBeInTheDocument()
})

test('after clicking view, url and likes are shown (5.14)', async () => {
  render(<Blog blog={sample} onLike={() => {}} onRemove={() => {}} own={true} />)
  await userEvent.click(screen.getByText('view'))
  expect(screen.getByText('https://example.com')).toBeInTheDocument()
  expect(screen.getByText(/likes 0/)).toBeInTheDocument()
  expect(screen.getByText(/Matti Luukkainen/)).toBeInTheDocument()
})

test('clicking like twice calls handler twice (5.15)', async () => {
  const onLike = vi.fn()
  render(<Blog blog={sample} onLike={onLike} onRemove={() => {}} own={true} />)
  await userEvent.click(screen.getByText('view'))
  await userEvent.click(screen.getByText('like'))
  await userEvent.click(screen.getByText('like'))
  expect(onLike).toHaveBeenCalledTimes(2)
})