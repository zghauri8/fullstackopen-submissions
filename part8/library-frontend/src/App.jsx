import { useEffect, useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommended from './components/Recommended'
import { ME, BOOK_ADDED, ALL_BOOKS } from './graphql'

// helper to update Apollo cache for ALL_BOOKS with a specific variables set
const updateAllBooksCache = (client, variables, addedBook) => {
  client.cache.updateQuery({ query: ALL_BOOKS, variables }, (existing) => {
    if (!existing) return { allBooks: [addedBook] }
    const exists = existing.allBooks.some((b) => b.id === addedBook.id)
    if (exists) return existing
    return { allBooks: existing.allBooks.concat(addedBook) }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [me, setMe] = useState(null)

  // load current user when token exists
  const { data: meData, refetch: refetchMe } = useQuery(ME, {
    skip: !token,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (meData?.me) setMe(meData.me)
  }, [meData])

  const onLogin = (tokenValue) => {
    localStorage.setItem('library-user-token', tokenValue)
    setToken(tokenValue)
    refetchMe()
    setPage('authors')
  }

  const logout = () => {
    localStorage.removeItem('library-user-token')
    setToken(null)
    setMe(null)
    setPage('authors')
  }

  // subscription: keep book lists up-to-date and alert on new book
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const added = data.data.bookAdded
      window.alert(`New book: ${added.title}`)

      // unfiltered cache
      updateAllBooksCache(client, { author: null, genre: null }, added)

      // update each genre-specific cache
      added.genres.forEach((g) => {
        updateAllBooksCache(client, { author: null, genre: g }, added)
      })
    },
  })

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}
      {page === 'add' && token && <NewBook />}
      {page === 'login' && !token && <Login onLogin={onLogin} />}

      {page === 'recommended' && token && me && (
        <Recommended favorite={me.favoriteGenre} />
      )}
    </div>
  )
}

export default App