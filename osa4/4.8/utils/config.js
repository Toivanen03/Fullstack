require('dotenv').config()
console.log('Current NODE_ENV at start:', process.env.NODE_ENV)

let PORT = process.env.PORT;
let MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

console.log('Current NODE_ENV after start:', process.env.NODE_ENV)
console.log('Current DB:', MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}