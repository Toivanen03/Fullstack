const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const express = require('express')
const cors = require('cors')
const http = require('http')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const typeDefs = require('./models/schema')
const resolvers = require('./models/resolvers')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
const passwrd = process.env.PASSWORD

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use('/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        try {
          const auth = req?.headers?.authorization || ''
          if (auth && auth.startsWith('Bearer ')) {
            try {
              const decodedToken = jwt.verify(auth.substring(7), passwrd)
              const currentUser = await User.findById(decodedToken.id).populate('friends')
              return { currentUser }
            } catch (error) {
              console.error('Token verification error:', error)
            }
          }
          return {}
        } catch (error) {
          console.error('Context error:', error)
          return {}
        }
      }
    })
  )
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  })
}

start()