// Apollo Server v4 + Express + Mongo + Auth + Subscriptions (graphql-ws) + DataLoader
import 'dotenv/config'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLError } from 'graphql'

// Subscriptions with graphql-ws
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws' // IMPORTANT: use/ws (not lib/use/ws)
import { PubSub } from 'graphql-subscriptions'

// DataLoader to prevent n+1
import DataLoader from 'dataloader'

// Mongoose models
import Author from './models/Author.js'
import Book from './models/Book.js'
import User from './models/User.js'

const pubsub = new PubSub()

const typeDefs = `#graphql
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

// Batch book counts by author id
const createBookCountLoader = () =>
  new DataLoader(async (authorIds) => {
    const ids = authorIds.map((id) => new mongoose.Types.ObjectId(id))
    const counts = await Book.aggregate([
      { $match: { author: { $in: ids } } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
    ])
    const map = new Map(counts.map((c) => [String(c._id), c.count]))
    return authorIds.map((id) => map.get(String(id)) || 0)
  })

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_root, args) => {
      const filter = {}
      if (args.author) {
        const a = await Author.findOne({ name: args.author })
        if (!a) return []
        filter.author = a._id
      }
      if (args.genre) filter.genres = args.genre
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (_root, _args, { currentUser }) => currentUser || null,
  },

  Author: {
    bookCount: (author, _args, { loaders }) => loaders.bookCount.load(author._id),
  },

  Mutation: {
    addBook: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', { extensions: { code: 'BAD_USER_INPUT' } })
      }
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        let author = await Author.findOne({ name: args.author }).session(session)
        if (!author) {
          author = await new Author({ name: args.author }).save({ session })
        }
        const book = new Book({ ...args, author: author._id })
        const saved = await book.save({ session })
        await session.commitTransaction()

        const populated = await saved.populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: populated }) // 8.23
        return populated
      } catch (err) {
        await session.abortTransaction()
        throw new GraphQLError('adding book failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error: err.message },
        })
      } finally {
        session.endSession()
      }
    },

    editAuthor: async (_root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', { extensions: { code: 'BAD_USER_INPUT' } })
      }
      const author = await Author.findOne({ name })
      if (!author) return null
      author.born = setBornTo
      try {
        return await author.save()
      } catch (err) {
        throw new GraphQLError('editing author failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: { name, setBornTo }, error: err.message },
        })
      }
    },

    createUser: async (_root, args) => {
      try {
        const user = new User(args)
        return await user.save()
      } catch (err) {
        throw new GraphQLError('creating user failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error: err.message },
        })
      }
    },

    login: async (_root, { username, password }) => {
      if (password !== 'secret') {
        throw new GraphQLError('wrong credentials', { extensions: { code: 'BAD_USER_INPUT' } })
      }
      const user = await User.findOne({ username })
      if (!user) {
        throw new GraphQLError('user not found', { extensions: { code: 'BAD_USER_INPUT' } })
      }
      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },

  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator('BOOK_ADDED') },
  },
}

async function start() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const app = express()
  app.use(cors())
  app.use(bodyParser.json())

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  // HTTP server
  const httpServer = http.createServer(app)

  // WS server for subscriptions
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' })

  // Context builders
  const buildHttpContext = async ({ req }) => {
    let currentUser = null
    const auth = req.headers.authorization
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
        currentUser = await User.findById(decoded.id)
      } catch (_) {}
    }
    return { currentUser, loaders: { bookCount: createBookCountLoader() } }
  }

  const buildWsContext = async (ctx) => {
    let currentUser = null
    const auth = ctx.connectionParams?.authorization || ctx.connectionParams?.Authorization
    if (auth && String(auth).toLowerCase().startsWith('bearer ')) {
      try {
        const decoded = jwt.verify(String(auth).substring(7), process.env.JWT_SECRET)
        currentUser = await User.findById(decoded.id)
      } catch (_) {}
    }
    return { currentUser, loaders: { bookCount: createBookCountLoader() } }
  }

  // Bind WS server to schema
  const serverCleanup = useServer({ schema, context: buildWsContext }, wsServer)

  // Apollo Server
  const server = new ApolloServer({ schema })
  await server.start()
  app.use(
'/graphql',
cors(),
express.json(), // or bodyParser.json()
expressMiddleware(server, { context: buildHttpContext })
)
  const PORT = process.env.PORT || 4000
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve))
  console.log(`GraphQL (HTTP+WS) at http://localhost:${PORT}/graphql`)

  // Graceful shutdown
  const shutdown = async () => {
    await serverCleanup.dispose()
    await mongoose.connection.close()
    httpServer.close(() => process.exit(0))
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((e) => {
  console.error(e)
  process.exit(1)
})