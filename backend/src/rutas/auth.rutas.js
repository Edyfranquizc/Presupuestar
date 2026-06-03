import express from "express"

const rutasAuth = express.Router()

rutasAuth.post("/login")
rutasAuth.post("/registro")

export default rutasAuth