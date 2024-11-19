import joi from "joi"
import { Request, Response, NextFunction } from "express"

const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required()
})

export const loginValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = loginSchema.validate(req.body)
  if (validate.error) return res.status(401).json({ message: validate.error.details.map(item => item.message).join(",") })
  return next()
}
