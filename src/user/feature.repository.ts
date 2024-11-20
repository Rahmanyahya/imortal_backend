import { prisma } from "../db/db";

export const getClasement = async () => {
  const data = await prisma.group.findMany({ include: { club: { orderBy: { menang: "asc" } } } })
  return await Promise.all(
    data.map(group => ({
      group_name: group.nama,
      club_list: group.club.map(item => ({
        id: item.id,
        nama: item.nama,
        main: item.main,
        poin: item.poin,
        menang: item.menang,
        kalah: item.kalah,
        seri: item.seri,
        goal: item.goal,
        kebobolan: item.kebobolan,
        selisih: item.selisih,
      }))
    }))
  )
}

export const getTopPlayerScore= async () => {
  const data = await prisma.pemain.findMany({take: 5 ,where: {goal: {gt: 0}} ,include: { club: { select: { nama: true } } }, orderBy: { goal: "asc" } })
  return await Promise.all(
    data.map(player => ({
      nama: player.nama,
      goal: player.goal,
      assist: player.assist,
      club: player.club.nama
    }))
  )
}

export const getTopAssistPlayer = async () => {
  const data = await prisma.pemain.findMany({ where: {assist: {gt: 0}} ,include: { club: { select: { nama: true } } }, orderBy: { assist: "asc" } })
  return await Promise.all(
    data.map(player => ({
      nama: player.nama,
      position: player.posisi,
      photo: player.photo,
      assist: player.assist,
      goal: player.goal,
      club: player.club.nama
    }))
  )
}
 
