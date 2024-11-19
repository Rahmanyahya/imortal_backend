import { NextFunction, Request, Response } from "express"
import joi from "joi"
import { deletePhoto } from "../helper/delete-file"

const idSchema = joi.object({
    id: joi.number().required().positive()
})

// GROUP SCHEMA 
const addGroupschema = joi.object({
    nama: joi.string().required()
})

export const addGroupValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = addGroupschema.validate(req.body)
    if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
}

const editGroupschema = joi.object({
    nama: joi.string().optional()
})

export const editGroupValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validationId = idSchema.validate(req.params)
    if (validationId.error) return res.status(400).json({message: validationId.error.details.map(item => item.message).join(" ")})
    const validationInput = editGroupschema.validate(req.body)
    if (validationInput.error) return res.status(400).json({message: validationInput.error.details.map(item => item.message).join(" ")})
    return next()
}

export const deleteGroupValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = idSchema.validate(req.params)
    if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
}

// CLUB SCHEMA
const addClubSchema = joi.object({
    nama: joi.string().required(),
    groupId: joi.number().required().positive(),
})

export const addClubValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = addClubSchema.validate(req.body)
    if (validation.error) {
        if (req.file != undefined) deletePhoto(req.file.filename, "club")
        return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    }
    return next()
}

const updateClubSchema = joi.object({
    nama: joi.string().optional(),
    groupId: joi.number().optional().positive(),
})


export const updateClubValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validationId = idSchema.validate(req.params)
    if (validationId.error) {
        if (req.file != undefined) deletePhoto(req.file.filename, "club")
        return res.status(400).json({message: validationId.error.details.map(item => item.message).join(" ")})}
    const validation = updateClubSchema.validate(req.body)
    if (validation.error) {
        if (req.file != undefined) deletePhoto(req.file.filename, "club")
        return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})}
    return next()
}

export const deleteClubValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = idSchema.validate(req.params)
    if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
}


export const statistikValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
   const validation = idSchema.validate(req.params)
   if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
};


// PEMAIN SCHEMA
const addPemainSchema = joi.object({
    nama: joi.string().required(),
    no: joi.number().required().positive(),
    posisi: joi.string().required(),
    clubId: joi.number().required().positive(),
})

export const addPemainValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = addPemainSchema.validate(req.body)
    if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
}

const updatePemainSchema = joi.object({
    nama: joi.string().optional(),
    no: joi.number().optional().positive(),
    posisi: joi.string().optional(),
    goal: joi.number().optional().positive(),
    assist: joi.number().optional().positive(),
    clubId: joi.number().optional().positive(),
})

export const updatePemainValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validationId = idSchema.validate(req.params)
    if (validationId.error) return res.status(400).json({message: validationId.error.details.map(item => item.message).join(" ")})
    const validation = updatePemainSchema.validate(req.body)
    if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
}

export const deletePemainValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = idSchema.validate(req.params)
    if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
}

const searchPemainSchema = joi.object({
    keyword: joi.string().required()
})

export const searchPemainValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = searchPemainSchema.validate(req.query)
    if (validation.error) return res.status(400).json({message: validation.error.details.map(item => item.message).join(" ")})
    return next()
}



