// models/Blog.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const commentSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  image: {
    type: String,
    default: ''
  },

  author: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },

  likes: [
    {
      type: Types.ObjectId,
      ref: 'User'
    }
  ],

  comments: [commentSchema]

}, { timestamps: true });

const Blog = model('Blog', blogSchema);
export default Blog;
