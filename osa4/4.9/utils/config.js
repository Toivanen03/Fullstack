require('dotenv').config()

let DATABASE = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
let PORT = process.env.PORT

module.exports = {
  DATABASE,
  PORT
}