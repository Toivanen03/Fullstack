const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Person = require('./person')
const User = require('./user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      personCount: async () => Person.collection.countDocuments(),
      allPersons: async (root, args) => {
        if (!args.phone) {
          return Person.find({})
        }
    
        return Person.find({ phone: { $exists: args.phone === 'YES'  }})
      },
      findPerson: async (root, args) => Person.findOne({ name: args.name }),
      me: (root, args, context) => {
        return context.currentUser
      }
    },
    Person: {
      address: (root) => {
        return {
          street: root.street,
          city: root.city,
        }
      },
      friendOf: async (root) => {
        const friends = await User.find({
          friends: {
            $in: [root._id]
          } 
        })
  
        return friends
      }
    },
    Mutation: {
      addPerson: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: { code: 'BAD_USER_INPUT' }
          })
        }
        const person = new Person({ ...args })
        try {
          await person.save()
          currentUser.friends = currentUser.friends.concat(person)
          await currentUser.save()
        } catch (error) {
          throw new GraphQLError('Saving person failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        pubsub.publish('PERSON_ADDED', { personAdded: person })
        return person
      },
      editNumber: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: { code: 'UNAUTHORIZED' }
          })
        }
        const person = await Person.findOne({ name: args.name })
        if (!person) {
          throw new GraphQLError('Person not found', {
            extensions: { code: 'BAD_USER_INPUT' }
          })
        }
        person.phone = args.phone
        try {
          await person.save()
        } catch (error) {
          throw new GraphQLError(error.message || 'Saving number failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.phone,
              error
            }
          })
        }
        return person
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, password: process.env.PASSWORD })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
        if ( !user || args.password !== process.env.PASSWORD ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        return { value: jwt.sign(userForToken, process.env.PASSWORD) }
      },
      addAsFriend: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('wrong credentials', {
            extensions: { code: 'BAD_USER_INPUT' }
          }) 
        }
    
        const nonFriendAlready = (person) => 
          !currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())
    
        const person = await Person.findOne({ name: args.name })
        if ( nonFriendAlready(person) ) {
          currentUser.friends = currentUser.friends.concat(person)
        }
        await currentUser.save()
        return currentUser
      },
    },
    Subscription: {
      personAdded: {
        subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED'),
      },
    },
  }

module.exports = resolvers