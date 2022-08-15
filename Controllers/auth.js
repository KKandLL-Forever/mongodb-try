import UserModel from "../Models/user.js";
import bcrypt from "bcrypt";


export const registUser = async (req, res) => {
  const {username, password, firstname, lastname} = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const newUser = new UserModel(
    {
      username,
      password: hashedPassword,
      firstname,
      lastname
    })
  
  try {
    await newUser.save()
    res.status(200).json(newUser)
  } catch (err) {
    console.log(err)
    res.status(500).json({message: err.message})
  }
}

// login
export const login = async (req, res) => {
  const {username, password} = req.body
  try {
    const user = UserModel.findOne({username})
    if (!user) res.status(401).json('username or password is wrong')
    const xxx = await bcrypt.compare(password, user.password)
    if (xxx) {
    
    }
  } catch (err) {
    console.log(err)
  }
}
