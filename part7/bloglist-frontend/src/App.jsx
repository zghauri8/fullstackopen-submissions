import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'

import { useNotification } from './contexts/NotificationContext'
import { useUser } from './contexts/UserContext'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import NavBar from './components/Navbar'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import Users from './components/Users'
import User from './components/User'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, notifyDispatch] = useNotification()
  const [user, userDispatch] = useUser()
  const blogFormRef = useRef()

  const notify = (message, type = 'info', seconds = 4) => {
    notifyDispatch({ type: 'SET', payload: { message, type } })
    setTimeout(() => notifyDispatch({ type: 'CLEAR' }), seconds * 1000)
  }

  // Load initial blogs
  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  const blogs = (blogsQuery.data || []).slice().sort((a, b) => b.likes - a.likes)

  // Load users only when logged in
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    enabled: !!user,
  })
  const users = usersQuery.data || []

  // Init user from localStorage
  useEffect(() => {
    const json = window.localStorage.getItem('loggedBlogappUser')
    if (json) {
      const saved = JSON.parse(json)
      userDispatch({ type: 'INIT', payload: saved })
      blogService.setToken(saved.token)
    }
  }, [userDispatch])

  // Mutations
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (created) => {
      // preserve user object for UI
      const createdWithUser = {
        ...created,
        user: { id: created.user, username: user.username, name: user.name },
      }
      queryClient.setQueryData(['blogs'], (old = []) =>
        [createdWithUser, ...old].sort((a, b) => b.likes - a.likes)
      )
      notify(`a new blog '${created.title}' by ${created.author} added`)
      blogFormRef.current?.toggleVisibility()
    },
    onError: (e) => notify(e.response?.data?.error || 'failed to create blog', 'error'),
  })

  const likeBlogMutation = useMutation({
    mutationFn: async (blog) => {
      const payload = { ...blog, likes: blog.likes + 1, user: blog.user?.id || blog.user }
      return blogService.update(blog.id, payload)
    },
    onSuccess: (updated) => {
      // keep prior user object from cache
      queryClient.setQueryData(['blogs'], (old = []) =>
        old
          .map((b) => (b.id === updated.id ? { ...updated, user: old.find(x => x.id === updated.id)?.user } : b))
          .sort((a, b) => b.likes - a.likes)
      )
    },
    onError: () => notify('failed to like blog', 'error'),
  })

  const removeBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData(['blogs'], (old = []) => old.filter((b) => b.id !== id))
      notify('removed blog')
    },
    onError: (e) => notify(e.response?.data?.error || 'failed to delete blog', 'error'),
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: (saved) => {
      // merge saved blog while preserving user reference
      queryClient.setQueryData(['blogs'], (old = []) =>
        old.map((b) => (b.id === saved.id ? { ...saved, user: b.user } : b))
      )
      notify('comment added')
    },
    onError: (e) => notify(e.response?.data?.error || 'failed to add comment', 'error'),
  })

  // Handlers
  const handleLogin = async ({ username, password }) => {
    try {
      const logged = await loginService.login({ username, password })
      userDispatch({ type: 'LOGIN', payload: logged })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(logged))
      blogService.setToken(logged.token)
      notify(`welcome ${logged.name}`)
      // make sure users query runs
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch {
      notify('wrong username/password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'LOGOUT' })
  }

  const addBlog = (blog) => createBlogMutation.mutate(blog)
  const likeBlog = (blog) => likeBlogMutation.mutate(blog)
  const removeBlog = (blog) => {
    if (!window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) return
    removeBlogMutation.mutate(blog.id)
  }
  const addComment = (id, comment) => addCommentMutation.mutate({ id, comment })

  if (!user) {
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
      <NavBar user={user} onLogout={handleLogout} />
      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <h3>create new</h3>
                <BlogForm onCreate={addBlog} />
              </Togglable>
              <BlogList blogs={blogs} />
            </>
          }
        />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User users={users} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={blogs}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
              onAddComment={addComment}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App