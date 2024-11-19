import Express from "express"
import cors from "cors"
import Login from "../src/login/login.router"
import User from "../src/user/feature.router"
import Admin from "../src/admin/feature.router"
import cookieParser from "cookie-parser"
const app = Express()

app.use(Express.json())
app.use(cors())
app.use(cookieParser())

app.use('/api/v1/auth', Login)
app.use('/api/v1/user', User)
app.use('/api/v1/admin', Admin)

app.listen(5000, () => console.log("running on local host 5000 || http://localhost:5000"))
