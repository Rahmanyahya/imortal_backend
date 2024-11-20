import {Router} from "express"
import { addGroupValidation, editGroupValidation,addClubValidation,addPemainValidation,deleteClubValidation,deleteGroupValidation,deletePemainValidation,searchPemainValidation,statistikValidation,updateClubValidation,updatePemainValidation } from "./feature.validation"
import { addGroupController, deleteGroupController, editGroupCOntroller, readGroupController, createClubController,addPemainController,deleteClubController,deletePemainController,getAllPemainByClubController,getAllPemainController,readClubController,searchPemainController,updateClubController,updatePemainController, plusMenang, minusMenang, plusSeriController, minusSeriController, plusKalahController, minusKalahController, tambahKebobolanController, kurangiKebobolanController, tambahGoalPlayerController, kurangiGoalPlayerController, tambahAssistPlayerController, minusAssistPlayerController } from "./feature.controller"
import { cekJwt } from "../middleware/check.jwt"
import { uploadPhoto, uploadPhotoClub } from "../middleware/upload-photo"

const router = Router()

// GROUP ROUTER
router.post('/group', cekJwt,addGroupValidation, addGroupController)
router.put('/group/:id', cekJwt,editGroupValidation, editGroupCOntroller)
router.get("/group", cekJwt, readGroupController)
router.delete('/group/:id', cekJwt,deleteGroupValidation, deleteGroupController)

// CLUB ROUTER
router.post('/club',  addClubValidation, createClubController)
router.put('/club/:id', updateClubValidation, updateClubController)
router.delete('/club/:id', cekJwt, deleteClubValidation, deleteClubController)
router.get('/club', cekJwt, readClubController)
router.put('/club/tambah/kemenangan/:id', cekJwt, statistikValidation,plusMenang)
router.put('/club/kurangi/kemenangan/:id', cekJwt, statistikValidation,minusMenang)
router.put('/club/tambah/kekalahan/:id', cekJwt, statistikValidation,plusKalahController)
router.put('/club/kurangi/kekalahan/:id', cekJwt, statistikValidation,minusKalahController)
router.put('/club/tambah/seri/:id', cekJwt, statistikValidation, plusSeriController)
router.put('/club/kurangi/seri/:id', cekJwt,statistikValidation, minusSeriController)
router.put('/club/tambah/kebobolan/:id', cekJwt, statistikValidation, tambahKebobolanController)
router.put('/club/kurangi/kebobolan/:id', cekJwt, statistikValidation, kurangiKebobolanController)

// PEMAIN ROUTER
router.post('/pemain', cekJwt, addPemainValidation, addPemainController)
router.put('/pemain/:id', cekJwt, updatePemainValidation, updatePemainController)
router.delete('/pemain/:id', cekJwt, deletePemainValidation, deletePemainController)
router.get('/pemain', cekJwt, getAllPemainController)
router.get('/pemain/club/:id', cekJwt, getAllPemainByClubController)
router.put('/pemain/statistik/tambah/goal/:id', cekJwt, statistikValidation, tambahGoalPlayerController)
router.put('/pemain/statistik/kurangi/goal/:id', cekJwt, statistikValidation, kurangiGoalPlayerController)
router.put('/pemain/statistik/tambah/assist/:id', cekJwt, statistikValidation, tambahAssistPlayerController)
router.put('/pemain/statistik/kurangi/assist/:id', cekJwt, statistikValidation, minusAssistPlayerController)
router.get('/pemain/search', cekJwt, searchPemainValidation, searchPemainController)
export default router 