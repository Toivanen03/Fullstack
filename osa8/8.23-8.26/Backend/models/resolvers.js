const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./author')
const Book = require('./book')
const User = require('./user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const pwd = 'supersecretkey'

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
          await book.populate('author')
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
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
      bookCount: async (author) => {
        const books = await Book.find({ author: author._id });
        return books.length
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
      },
    },
  }

  module.exports = resolvers