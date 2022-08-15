import express from "express";
import {login, registUser} from "../Controllers/auth.js";


const router = express.Router()

router.post('/regist', registUser)
router.post('/login', login)

export default router
