import { Router } from "express"
import { loginValidation } from "./login.validation"
import { LoginController } from "./login.controller"


const router = Router()

router.post('/login', loginValidation, LoginController)

export default router
