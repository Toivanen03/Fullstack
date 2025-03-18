const { gql } = require('graphql-tag')

const typeDefs = gql `
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

    type Subscription {
        bookAdded: Book!
    }
`

module.exports = typeDefs