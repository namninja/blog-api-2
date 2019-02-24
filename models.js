"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// this is our schema to represent authors
const authorSchema = mongoose.Schema({
  firstName: { type: String, trim:true },
  lastName: { type: String, trim:true },
  userName: { type: String, trim:true, unique: true }
});

let commentSchema = mongoose.Schema({ content: 'string' });

const blogPostSchema = mongoose.Schema({
  title: { type: String, trim:true },
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  created: {type: Date, default: Date.now},
  comments: [commentSchema]
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
})

blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
})


// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
blogPostSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
    comments: this.comments
  };
};

authorSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    userName: this.userName
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = { Author, BlogPost };
