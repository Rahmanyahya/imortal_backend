import { Request, Response } from "express";
import { prisma } from "../db/db";
import { addClub, addGroup, addPemain, deleteClub, deleteGroup, deletePemain, editClub, editGroup, getAllPemain, getAllPemainByClub, kurangiKebobolan, minusAssist, minusGoal, minusKalah, minusKemenangan, minusSeri, plusKalah, plusKemenangan, plusSeri, searchPemain, tambahAssist, tambahGoal, tambahKebobolan, updatePemain } from "./feature.repo";
import { deletePhoto } from "../helper/delete-file";
import { getClasement } from "../user/feature.repository";


// GROUP CONTROLLER
export const addGroupController =  async (req: Request, res: Response):Promise<any> => {
    try {
        const {nama} = req.body

        const isGroupExist = await prisma.group.count({where: {nama}})

        if (isGroupExist != 0) return res.status(400).json({message: "group is exits"})

        const response = await addGroup(nama)

        return res.status(200).json({message: response})
    } catch (error) {
        return res.status(500).json({message: "something went erong please try again"})
    }
}

export const editGroupCOntroller = async (req: Request, res: Response): Promise<any>  => {
    try {
        const id = Number(req.params.id)
        let {nama} = req.body

        const isGroupExist = await prisma.group.findFirst({where: {id}})

        if (!isGroupExist) return res.status(400).json({message: "group not found"})

        if (nama == isGroupExist.nama) return res.status(400).json({message: "cannot change group because is same name"})
        
        nama ??= isGroupExist.nama

        const response = await editGroup(id, nama)

        return res.status(200).json({message: response})
    } catch (error) {
        return res.status(500).json({message: "something went erong please try again"})
    }
}

export const deleteGroupController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const id = Number(req.params.id)

        const isGroupExist = await prisma.group.findFirst({where: {id}, include: {club: {include: {pemain: true}}}})

        if (!isGroupExist) return res.status(400).json({message: "group not found"})

        const response = await deleteGroup(id)

        return res.status(200).json({message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went erong please try again"})
    }
}

export const readGroupController = async (req: Request, res: Response): Promise<any>  => {
    try {
        let response = await prisma.group.findMany()

        const response2 = response.map(item => ({
            id: item.id,
            nama: item.nama
        }))

        return res.status(200).json({message: response2})
    } catch (error) {
        return res.status(500).json({message: "something went erong please try again"})
    }
}

// CLUB CONTROLLER 
export const createClubController = async (req: Request, res: Response): Promise<any>  => {
    try {
        let logo;
        const {nama, groupId} = req.body as {nama: string, groupId: number}

        const isGroupFull = await prisma.club.findMany({where: {groupId: Number(groupId)}})

        if (isGroupFull.length == 8) {
         if (req.file != undefined) deletePhoto(req.file.filename, "club")        
             return res.status(400).json({message: "group is full"})
        }
        
        const isClubExist = await prisma.club.count({where: {AND : {
            nama,
            groupId: Number(groupId)
        }}})

        if (isClubExist != 0) { 
         if (req.file != undefined) deletePhoto(req.file.filename, "club")        
           return res.status(400).json({message: "club is exits"}) 
         }

        req.file != undefined ? logo = req.file.filename : logo = "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"

         const response = await addClub(nama, Number(groupId), logo)

        return res.status(200).json({message: response})
    } catch (error) {
        console.log(error)
        if (req.file != undefined) deletePhoto(req.file.filename, "club")
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const updateClubController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const id = Number(req.params.id)
        let { nama, groupId } = req.body

        let isClubExist = await prisma.club.findFirst({ where: { id } })

        if (!isClubExist) {
            if (req.file != undefined) deletePhoto(req.file.filename, "club")
            return res.status(400).json({ message: "club not found" })
        }

       
        if (req.file != undefined) {
    
            deletePhoto(isClubExist.logo, "club")
            
            isClubExist.logo = req.file.filename
        }

      
        nama ??= isClubExist.nama
        groupId ??= isClubExist.groupId

    
        const checkDuplicateUpdate = await prisma.club.count({
            where: {
                AND: [
                    { nama },
                    { groupId: Number(groupId) },
                    { logo: isClubExist.logo }
                ]
            }
        })

       
        if (checkDuplicateUpdate > 0) {
            return res.status(400).json({ message: "No changes detected or club already exists with this configuration." })
        }

        
        const response = await editClub(id, nama, Number(groupId), isClubExist.logo) 

        return res.status(200).json({message: response})

    } catch (error) {
        console.error("Error updating club: ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const deleteClubController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(400).json({message: "club not found"})

        const response = await deleteClub(id)
        deletePhoto(isClubExist.logo, "club")

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const readClubController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const response = await getClasement()
        return res.status(200).json({message: response})
    } catch (error) {
        return res.status(500).json({message: "something went erong please try again"})
    }
}

export const plusMenang = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(400).json({message: "club not found"})

        if (isClubExist.menang == 7) return res.status(400).json({message: "Limits"})
        const response = await plusKemenangan(isClubExist)

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}
   
export const minusMenang = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(400).json({message: "club not found"})
        
        if (isClubExist.kalah == 0) return res.status(400).json({message: "Limits"})
        const response = await minusKemenangan(isClubExist)

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const plusSeriController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(400).json({message: "club not found"})

            if (isClubExist.seri == 7) return res.status(400).json({message: "Limits"})
        const response = await plusSeri(isClubExist)

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const minusSeriController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(400).json({message: "club not found"})

            if (isClubExist.seri == 0) return res.status(400).json({message: "Limits"})
        const response = await minusSeri(isClubExist)

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const plusKalahController = async (req: Request, res:Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(400).json({message: "club not found"})

            if (isClubExist.kalah == 7) return res.status(400).json({message: "Limits"})
        const response = await plusKalah(isClubExist)

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const minusKalahController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(400).json({message: "club not found"})

            if (isClubExist.kalah == 0) return res.status(400).json({message: "Limits"})
        const response = await minusKalah(isClubExist)

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const tambahKebobolanController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})
        if (!isClubExist) return res.status(400).json({message: "club not found"})

        const response = await tambahKebobolan(isClubExist)
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong"})
    }
}

export const kurangiKebobolanController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isClubExist = await prisma.club.findFirst({where: {id}})
        if (!isClubExist) return res.status(400).json({message: "club not found"})

        if (isClubExist.kebobolan == 0) return res.status(404).json({message: "limits"})
        const response = await kurangiKebobolan(isClubExist)
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong"})
    }
}

// PEMAIN
export const addPemainController = async (req: Request, res: Response): Promise<any>  => {
    try {
        let file;
        const {nama, no, posisi, clubId} = req.body

        const isClubExist = await prisma.club.findFirst({where: {id: Number(clubId)}, include: {pemain: {select: {photo: true}}}})

        if (!isClubExist) {
            if (req.file != undefined) deletePhoto(req.file.filename, "player_photo")
            return res.status(400).json({message: "club not found"})
        }

        const isPlayerExist = await prisma.pemain.count({where: {
            AND: {
                nama,
                no: Number(no), 
                posisi,
                clubId: Number(clubId)
            }
        }})

        if (isPlayerExist != 0) {
            if (req.file != undefined) deletePhoto(req.file.filename, "player_photo")             
            return res.status(404).json({message: "pemain is exist"})
        } 

        req.file? file = req.file.filename : file = "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"

        const response = await addPemain(nama, file, Number(no), posisi, Number(clubId))

        return res.status(200).json({ message: response})
    } catch (error) {
        console.log(error)
        if (req.file != undefined) deletePhoto(req.file.filename, "player_photo")             
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const updatePemainController = async (req: Request, res: Response): Promise<any>  => {
    try {
        let file;
        const id = Number(req.params.id)
        let {nama, no, posisi, clubId} = req.body
        const isPlayerExist = await prisma.pemain.findFirst({where: {id}})

        if (!isPlayerExist) {
        if (req.file!= undefined) deletePhoto(req.file.filename, "player_photo")
        return res.status(404).json({message: "pemain not found"})
        }

         nama??= isPlayerExist.nama
         no??= isPlayerExist.no
        posisi??= isPlayerExist.posisi
        file = req.file?.filename ?? isPlayerExist.photo
        clubId??= isPlayerExist.clubId

        const isClubExist = await prisma.club.findFirst({where: {id: Number(clubId)}})

        if (!isClubExist) {
            if (req.file!= undefined) deletePhoto(req.file.filename, "player_photo")
            return res.status(400).json({message: "club not found"})
        }

        const isDuplicate = await prisma.pemain.count({
            where: {
                AND: {
                    nama,
                    no,
                    posisi,
                    clubId,
                    id
                }
            }
        })

        if (isDuplicate != 0) {
        if (req.file!= undefined) deletePhoto(req.file.filename, "player_photo")
        return res.status(200).json({message: "duplicate update"})
        }

        const response = await updatePemain(id, nama, isPlayerExist.photo, no, posisi, clubId)
        deletePhoto(isPlayerExist.photo, "player_photo")
        return res.status(200).json({ message: response})

    } catch (error) {
        console.log(error)
        if (req.file!= undefined) deletePhoto(req.file.filename, "player_photo")
        return res.status(500).json({message: "something went wrong plese try again"})
    }
}

export const deletePemainController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const id = Number(req.params.id)
        const isPlayerExist = await prisma.pemain.findFirst({where: {id}})

        if (!isPlayerExist)  return res.status(404).json({message: "pemain not found"})
        
        const response = await deletePemain(id)
        deletePhoto(isPlayerExist.photo, "player_photo")

        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const getAllPemainByClubController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const id = Number(req.params.id)
        const isClubExist = await prisma.club.findFirst({where: {id}})

        if (!isClubExist) return res.status(404).json({message: "club not found"})

        const response = await getAllPemainByClub(id)

        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const searchPemainController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const { keyword } = req.query as {keyword: string}
        const response = await searchPemain(keyword)
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const getAllPemainController = async (req: Request, res: Response): Promise<any>  => {
    try {
        const response = await getAllPemain()
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const tambahGoalPlayerController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isPlayerExist = await prisma.pemain.findFirst({where: {id}})
        if (!isPlayerExist) return res.status(404).json({message: "pemain not found"})
        
        const response = await tambahGoal(isPlayerExist)
        
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const kurangiGoalPlayerController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isPlayerExist = await prisma.pemain.findFirst({where: {id}})
        if (!isPlayerExist) return res.status(404).json({message: "pemain not found"})
        if (isPlayerExist.goal == 0) return res.status(400).json({message: "limits"})
        const response = await minusGoal(isPlayerExist)
        
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const tambahAssistPlayerController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isPlayerExist = await prisma.pemain.findFirst({where: {id}})
        if (!isPlayerExist) return res.status(404).json({message: "pemain not found"})
        
        const response = await tambahAssist(isPlayerExist)
        
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}

export const minusAssistPlayerController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)

        const isPlayerExist = await prisma.pemain.findFirst({where: {id}})
        if (!isPlayerExist) return res.status(404).json({message: "pemain not found"})
            if (isPlayerExist.assist == 0) return res.status(400).json({message: "limits"})
        const response = await minusAssist(isPlayerExist)
        
        return res.status(200).json({ message: response})
    } catch (error) {
        return res.status(500).json({message: "something went wrong please try again"})
    }
}
