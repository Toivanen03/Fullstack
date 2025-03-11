const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { gql } = require('graphql-tag')
const Author = require('./models/author')
const Book = require('./models/book')
const mongoose = require('mongoose')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const pwd = 'supersecretkey'

mongoose.set('strictQuery', false)
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
console.log('connecting to', MONGODB_URI)

const typeDefs = gql`
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
    me: User
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User

    login(
    username: String!
    password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          return []
        }
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }
      return await Book.find(filter).populate('author')
    },
    allAuthors: async () => await Author.find(),

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (err) {
          throw new GraphQLError('Author validation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              message: err.message
            }
          })
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
        return await book.populate('author')
      } catch (err) {
        throw new GraphQLError('Book validation failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            message: err.message
          }
        })
      }
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      try {
        await author.save()
        return author
      } catch (err) {
        throw new GraphQLError('Author edit failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            message: err.message
          }
        })
      }
    },

    createUser: async (root, args) => {
      const existingUser = await User.findOne({ username: args.username })
      if (existingUser) {
        throw new GraphQLError('Username already taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username
          }
        })
      }
      const user = new User({ 
        username: args.username, 
        password: pwd,
        favoriteGenre: args.favoriteGenre 
      })
    
      try {
        await user.save()
        return user
      } catch (err) {
        throw new GraphQLError('User creation failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            message: err.message
          }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== user.password) {
        throw new GraphQLError('Invalid credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args
          }
        })
      }
      const token = jwt.sign({ username: user.username, id: user.id }, pwd, {
        expiresIn: '1h'
      })
      return { value: token }
    }
  },

  Author: {
    bookCount: async (author) => await Book.countDocuments({ author: author._id })
  }
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })
    startStandaloneServer(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || ''
        const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth
        if (token) {
          try {
            const decodedToken = jwt.verify(token, pwd)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (error) {
            throw new GraphQLError('Invalid or expired token', {
              extensions: { code: 'UNAUTHORIZED' }
            })
          }
        }
        return {}
      },
      listen: { port: PORT },
    }).then(({ url }) => {
      console.log(`Server ready at ${url}`)
    }).catch((err) => {
      console.error('Error starting Apollo Server:', err)
    })
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })