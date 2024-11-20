import { Request, Response } from "express";
import { getClasement, getTopAssistPlayer, getTopPlayerScore } from "./feature.repository";

export const getClasementController = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = await getClasement()
        return res.status(200).json({message: data})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const getTopGoalPlayerController = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = await getTopPlayerScore()
       return res.status(200).json({message: data})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const getTopAssistPlayerController = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = await getTopAssistPlayer()
       return res.status(200).json({message: data})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}