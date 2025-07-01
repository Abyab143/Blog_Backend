// controllers/blogController.js
import Blog from '../Models/Blog.js';
import User from '../Models/User.js';
import mongoose from 'mongoose';

// GET: All blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .populate('comments.user', 'name email');

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

// GET: Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

// POST: Create blog
export const createBlog = async (req, res) => {
  const { title, content, image, author } = req.body;

  try {
    const user = await User.findById(author);
    if (!user) return res.status(404).json({ message: 'Author not found' });

    const blog = new Blog({ title, content, image, author });
    const savedBlog = await blog.save();

    user.blogs.push(savedBlog._id);
    await user.save();

    res.status(201).json({ message: 'Blog created', blog: savedBlog });
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog', error: err.message });
  }
};

// PUT: Update blog
export const updateBlog = async (req, res) => {
  const { title, content, image } = req.body;

  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog updated', blog });
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};

// DELETE: Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Remove blog from user's list
    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id }
    });

    res.status(200).json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};

// POST: Like/Unlike blog
export const toggleLike = async (req, res) => {
  const {userId }= req.body;
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes.pull(userId);
      await blog.save();
      return res.status(200).json({ message: 'Unliked blog' });
    } else {
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: 'Liked blog' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error toggling like', error: err.message });
  }
};

// POST: Add comment
export const addComment = async (req, res) => {
  const { userId, text } = req.body;
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.push({ user: userId, text });
    await blog.save();

    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

// DELETE: Comment from blog
export const deleteComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.pull({ _id: commentId });
    await blog.save();

    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};
