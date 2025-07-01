import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {getAllUsers,getUserById,registerUser,deleteUser,updateUser,loginUser} from "./Controllers/User.js";
import {createBlog,addComment,deleteBlog,getAllBlogs,toggleLike,updateBlog, getBlogById, deleteComment,} from "./Controllers/Blog.js";
import { authMiddleware } from "./Middleware.js";
authMiddleware;
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(bodyParser.json());

const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

// MongoDB connection
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:"Blog"
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));
//user route 
app.get("/user/Alluser",getAllUsers);
app.post("/user/register",registerUser);
app.put("/user/update",authMiddleware,updateUser);
app.delete("/user/delete",authMiddleware,deleteUser);
app.get("/user/:id",getUserById);
app.post("/user/login",loginUser);


// blog route 
app.get("/blog",getAllBlogs);
app.post("/blog/create",authMiddleware,createBlog);
app.put("/blog/update/:id",authMiddleware,updateBlog);
app.delete("/blog/delete/:id",authMiddleware,deleteBlog);
app.get("/blog/:id",getBlogById);
app.post("/blog/like/:id",authMiddleware,toggleLike);
app.post("/blog/comment/add/:id",authMiddleware,addComment);
app.delete("/blog/comment/delete/:blogId/:commentId",authMiddleware,deleteComment)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
