import express from "express";
import {collection} from "../DbAccess.js";



const router = express.Router()

router.get('/', async (req, res) => {
  const res2 = await collection.findOne({name: 'Ribeira Charming Duplex'})
  res.send(res2)
})

export default router
