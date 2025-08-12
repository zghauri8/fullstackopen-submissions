import { useEffect, useRef, useState } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: 'info' })
  const blogFormRef = useRef()

  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: 'info' }), 4000)
  }

  useEffect(() => {
    blogService.getAll().then(b => {
      setBlogs(b.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const json = window.localStorage.getItem('loggedBlogappUser')
    if (json) {
      const u = JSON.parse(json)
      setUser(u)
      blogService.setToken(u.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const logged = await loginService.login({ username, password })
      setUser(logged)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(logged))
      blogService.setToken(logged.token)
      notify(`welcome ${logged.name}`)
    } catch (e) {
      notify('wrong username/password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blog) => {
    try {
      const created = await blogService.create(blog)
      // created.user is id; keep the current user object in state (fix for 5.9)
      const createdWithUser = { ...created, user: { id: created.user, username: user.username, name: user.name } }
      setBlogs(prev => [createdWithUser, ...prev].sort((a, b) => b.likes - a.likes))
      notify(`a new blog '${created.title}' by ${created.author} added`)
      blogFormRef.current?.toggleVisibility()
    } catch (e) {
      notify(e.response?.data?.error || 'failed to create blog', 'error')
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedPayload = { ...blog, likes: blog.likes + 1, user: blog.user?.id || blog.user } // send id to backend
      const updated = await blogService.update(blog.id, updatedPayload)
      // keep user object in state (fix 5.9)
      const updatedWithUser = { ...updated, user: blog.user }
      setBlogs(prev =>
        prev.map(b => (b.id === blog.id ? updatedWithUser : b)).sort((a, b) => b.likes - a.likes)
      )
    } catch (e) {
      notify('failed to like blog', 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) return
    try {
      await blogService.remove(blog.id)
      setBlogs(prev => prev.filter(b => b.id !== blog.id))
      notify(`removed '${blog.title}'`)
    } catch (e) {
      notify(e.response?.data?.error || 'failed to delete blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <h3>create new</h3>
        <BlogForm onCreate={addBlog} />
      </Togglable>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={likeBlog}
          onRemove={removeBlog}
          own={blog.user?.username === user.username}
        />
      ))}
    </div>
  )
}

export default App