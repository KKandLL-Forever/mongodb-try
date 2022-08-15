import PostModel from "../Models/post.js";
import UserModel from '../Models/user.js';

import bcrypt from "bcrypt";

// create new post
export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body)
  
  try {
    await newPost.save()
    res.status(200).json("post created!")
  } catch (err) {
    res.status(500).json('post error')
  }
}

// get post
export const getPost = async (req, res) => {
  const id = req.params.id
  
  try {
    const post = await PostModel.findById(id)
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json('post error')
  }
}

// update post
export const updatePost = async (req, res) => {
  const id = req.params.id
  const {userId} = req.body
  
  try {
    const post = await PostModel.findById(id)
    if (post.userId === userId) {
      await post.updateOne({$set: req.body})
      res.status(200).json('update post successfully')
    } else {
      res.status(403).json('Action forbidden')
    }
  } catch (err) {
    res.status(500).json('post error')
  }
}

// delete post
export const deletePost = async (req, res) => {
  const id = req.params.id
  const {userId} = req.body
  
  try {
    const post = await PostModel.findById(id)
    if (post.userId === userId) {
      await post.deleteOne({$set: req.body})
      res.status(200).json('delete post successfully')
    } else {
      res.status(403).json('Action forbidden')
    }
  } catch (err) {
    res.status(500).json('post error')
  }
}

// like a post
export const likePost = async (req, res) => {
  const id = req.params.id
  const {userId} = req.body
  
  try {
    const post = await PostModel.findById(id)
    if(!post.likes.includes(userId)){
      await post.updateOne({$push: {likes: userId}})
      res.status(200).json('like post successfully')
    } else {
      await post.updateOne({$pull: {likes: userId}})
      res.status(200).json('dislike post successfully')
    }
  } catch (err) {
    res.status(500).json('post error')
  }
}

// get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  
  try {
    const currentUserPosts = await PostModel.find({userId: userId})
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: userId
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts"
        }
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0
        }
      }
    ])
    res
      .status(200)
      .json(currentUserPosts.concat(...followingPosts[0].followingPosts))
      .sort((a,b) => {
        return b.createdAt - a.createdAt
      })
  } catch (err) {
    res.status(500).json('get data error')
  }
  
}
