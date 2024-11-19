import Router from "express"
import { getClasementController, getTopAssistPlayerController, getTopGoalPlayerController } from "./feature.controller"

const router = Router()

// geting clasement data
router.get('/clasement', getClasementController)

// geting top score player data
router.get('/topscore', getTopGoalPlayerController)

// geting data top assist player
router.get('/topassist', getTopAssistPlayerController)

export default router