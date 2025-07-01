// models/User.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  img: {
    type: String,
    default: ''
  },

  blogs: [
    {
      type: Types.ObjectId,
      ref: 'Blog'
    }
  ]
}, { timestamps: true });

const User = model('User', userSchema);
export default User;
