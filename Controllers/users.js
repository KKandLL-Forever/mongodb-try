import UserModel from "../Models/user.js";
import bcrypt from "bcrypt";


// get user info
export const getUser = async (req, res) => {
  const id = req.params.id
  try {
    const user = await UserModel.findById(id)
    if (!user) res.status(404).json('user does not exist')
    // 返回值中去掉password
    const {password, ...otherData} = user._doc
    res.status(200).json(otherData)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

// update user info
export const updateUser = async (req, res) => {
  const id = req.params.id
  const {currentUserId, currentUserAdminStatus, password } = req.body
  
  // hash the password
  if (password) {
    const salt = await bcrypt.genSalt(10)
    req.body.password = bcrypt.hash(password, salt)
  }
  
  // 当前用户和管理员
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true})
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json(err)
    }
  }else {
    res.status(403).json('Access denied! you can only update your own info')
  }
}

// delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id
  const {currentUserId, currentUserAdminStatus } = req.body
  
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id)
      res.status(200).json('deleted the user successfully')
    } catch (err) {
      res.status(500).json(err)
    }
  }else {
    res.status(403).json('Access denied! you can only delete your own info')
  }
}
// Follow a user
export const followUser = async (req, res) => {
  const id = req.params.id
  const {currentUserId} = req.body
  
  if (id === currentUserId ) {
    res.status(403).json("Action forbidden")
  } else {
    try {
      const targetUser = await UserModel.findByIdAndDelete(id)
      const currentUser = await UserModel.findById(currentUserId)
      
      // 确保要follow的人不在已经follow的名单中
      if(!currentUser.followers.includes(currentUserId)){
        // 被关注的人更新被关注列表
        await targetUser.updateOne({$push: {followers:currentUserId}})
        // 现有用户更新已关注列表
        await currentUser.updateOne({$push: {following: id}})
        res.status(200).json('followed successfully')
      } else {
        res.status(403).json('User is Already followed by you')
      }
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

// unFollow a user
export const unFollowUser = async (req, res) => {
  const id = req.params.id
  const {currentUserId} = req.body
  
  if (id === currentUserId ) {
    res.status(403).json("Action forbidden")
  } else {
    try {
      const targetUser = await UserModel.findByIdAndDelete(id)
      const currentUser = await UserModel.findById(currentUserId)
      
      // 确保要follow的人不在已经follow的名单中
      if(!currentUser.followers.includes(currentUserId)){
        // 被关注的人更新被关注列表
        await targetUser.updateOne({$pull: {followers:currentUserId}})
        // 现有用户更新已关注列表
        await currentUser.updateOne({$pull: {following: id}})
        res.status(200).json('unfollowed successfully')
      } else {
        res.status(403).json('User is not followed by you')
      }
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
