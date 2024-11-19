import bcrypt from "bcrypt"
import dotenv from "dotenv/config"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { checkUser } from "./login.repository"

export const LoginController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body
    const isUserExist = await checkUser(username)
    if (!isUserExist) return res.status(401).json({ message: "your email; or password isnot valid" })

    bcrypt.compare(password, isUserExist.password, (err, _) => {
      if (err) return res.status(401).json({ message: "your email or password is not valid" })
      res.cookie("token", jwt.sign(isUserExist.username, String(process.env.SECRET)))
      return res.status(200).json({ message: "succes login" })
    })
  } catch (e) {
    return res.status(500).json({ message: "something went erong please try again" })
  }
}
