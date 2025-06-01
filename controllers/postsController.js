const { createPostSchema } = require("../middlewares/validator");
const Post = require("../models/postModels");

exports.getPosts = async (req, res) => {
  const { page } = req.query;
  const postsPerPage = 10; // Define how many posts you want per page

  try {
    let pageNum = 0;
    if (page <= 1) {
      pageNumber = 0; // Default to the first page if the page number is invalid
    } else {
      pageNum = page - 1; // Convert to zero-based index
    }
    const result = await Post.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(pageNum * postsPerPage) // Skip the posts for previous pages
      .limit(postsPerPage) // Limit the number of posts per page
      .populate({
        path: "userId",
        select: "email", // Populate author details with name and profile picture
      }); // Populate author details
    res.status(200).json({
      success: true,
      message: "Posts",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user; // Assuming user ID is stored in req.user after authentication

  try {
    const { error, value } = createPostSchema.validate({
      title,
      description,
      userId,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const result = await Post.create({
      title,
      description,
      userId,
    });
    res.status(201).json({
      success: true,
      message: "created",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.singlePost = async (req, res) => {
  const { _id } = req.query;

  try {
    const existingPost = await Post.findOne({ _id }).populate({
      path: "userId",
      select: "email",
    });
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "single post",
      data: existingPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  const { _id } = req.query;
  const { title, description } = req.body;
  const { userId } = req.user; // Assuming user ID is stored in req.user after authentication

  try {
    const { error, value } = createPostSchema.validate({
      title,
      description,
      userId,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const existingPost = await Post.findOne({ _id });
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (existingPost.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }
    existingPost.title = title;
    existingPost.description = description;

    const result = await existingPost.save();
    res.status(200).json({
      success: true,
      message: "Updated",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
