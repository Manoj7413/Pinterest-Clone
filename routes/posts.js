const mongoose = require('mongoose');
const users = require('./users');

// Define Post Schema
const postSchema = new mongoose.Schema({
  imagetext: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// Export Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
