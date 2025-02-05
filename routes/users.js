const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/MongoData");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true , unique: true},
    fullname: { type: String, required: true},
    password: { type: String},
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String},
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    contact: Number,
    boards:{
      type: Array,
      default: []
    }
  }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
