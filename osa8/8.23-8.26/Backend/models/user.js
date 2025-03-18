const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favoriteGenre: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)