import { Club, group_name, Pemain, Posisi } from "@prisma/client";
import { prisma } from "../db/db";
import { deletePhoto } from "../helper/delete-file";


// CRUD GROUP
export const addGroup = async (nama: group_name) => {
  return await prisma.group.create({ data: { nama: nama } })
}

export const editGroup = async (id: number, nama: group_name) => {
  return await prisma.group.update({ where: { id }, data: { nama } })
}

export const deleteGroup = async (id: number) => {
  const data = await prisma.group.delete({ where: { id }, include: {club: {include: {pemain: true}}} })

  if (data.club.length != 0) await Promise.all(data.club.map(item => {
    deletePhoto(item.logo, "club")
    item.pemain.map(item => {
      deletePhoto(item.photo, "player_photo")
    })
  }))

  return "OK"
}

export const readGroup = async () => {
  return await prisma.group.findMany({ select: { id: true, nama: true } })
}

// CRUD CLUB
export const addClub = async (nama: string, groupId: number, logo: string) => {
  const data = await prisma.club.create({ data: { nama, groupId: Number(groupId), logo }, include: { group: { select: { nama: true } } } })
  return {
    id: data.id,
    nama: data.nama,
    group: data.group.nama
  }
}

export const editClub = async (id: number, nama: string, groupId: number, logo: string) => {
  const data = await prisma.club.update({ where: { id }, data: { nama, groupId, logo }, include: { group: { select: { nama: true } } } })
  return {
    id: data.id,
    nama: data.nama,
    group: data.group.nama
  }
}

export const deleteClub = async (id: number) => {
  const data = await prisma.club.delete({ where: { id }, include: {pemain: true} })
  if (data.pemain.length != 0) await Promise.all(data.pemain.map(item => {
    deletePhoto(item.photo, "player_photo")
  }))
  return "OK"
}

export const plusKemenangan = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {menang: club.menang + 1, poin: club.poin + 3}})
  return data
}

export const minusKemenangan = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {menang: club.menang - 1, poin: club.poin - 3}})
  return data
}

export const plusKalah = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {kalah: club.kalah + 1}})
  return data
}

export const minusKalah = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {kalah: club.kalah - 1}})
  return data
}

export const plusSeri = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {seri: club.seri + 1, poin: club.poin + 1}})
  return data
}

export const minusSeri = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {seri: club.seri - 1, poin: club.poin - 1}})
  return data
}

export const tambahKebobolan = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {kebobolan: club.kebobolan + 1, selisih: (club.kebobolan + 1) - club.goal}})
  return data
}

export const kurangiKebobolan = async (club: Club): Promise<any> => {
  const data = await prisma.club.update({where: {id: club.id}, data: {kebobolan: club.kebobolan - 1, selisih: club.goal - (club.kebobolan - 1)}})
  return data
}

// PEMAIN CRUD
export const addPemain = async (nama: string, photo: string, no: number, posisi: Posisi , clubId: number): Promise<any> => {
  const data = await prisma.pemain.create({ data: { nama, no, photo, posisi, clubId } })
  return {
    nama: data.nama,
    no: data.no,
    posisi: data.posisi
  }
}

export const updatePemain = async (id:number,nama: string, photo: string, no: number, posisi: Posisi , clubId: number): Promise<any> => {
  const data = await prisma.pemain.update({where: {id}, data: { nama, no, photo, posisi, clubId } })
  return {
    nama: data.nama,
    no: data.no,
    posisi: data.posisi
  }
}

export const getAllPemainByClub = async (idClub: number): Promise<any> => {
  const data = await prisma.pemain.findMany({where: {clubId: idClub}})
  return await Promise.all(data.map(item => ({
    id: item.id,
    photo: item.photo,
    nama: item.nama,
    no: item.no,
    posisi: item.posisi,
    goal: item.goal,
    assist: item.assist,
  })))
}

export const searchPemain = async (keyword: string): Promise<any> => {
  const data = await prisma.pemain.findMany({
    where: {
      nama: {contains: keyword}
    }
  , include: {club: {select: {nama: true}}}})

  return await Promise.all(data.map(item => ({
    photo: item.photo,
    nama: item.nama,
    posisi: item.posisi,
    club: item.club.nama,
    goal: item.goal,
    assist: item.assist
  })))
}

export const getAllPemain = async (): Promise<any> => {
  const data = await prisma.pemain.findMany({
  include: {club: {select: {nama: true}}}
  })

  return await Promise.all(data.map(item => ({
    photo: item.photo,
    nama: item.nama,
    posisi: item.posisi,
    club: item.club.nama,
    goal: item.goal,
    assist: item.assist
  })))
}

export const tambahGoal = async (pemain: Pemain): Promise<any> => {
  const data = await prisma.pemain.update({where: {id: pemain.id}, data: {goal: pemain.goal + 1}, include: {club: true}})
  await prisma.club.update({where: {id: data.club.id}, data: {goal: data.club.goal + 1, selisih: (data.club.goal + 1) - data.club.kebobolan }})
  return data
}

export const tambahAssist = async (pemain: Pemain): Promise<any> => {
  const data = await prisma.pemain.update({where: {id: pemain.id}, data: {assist: pemain.assist + 1}})
  return data
}

export const minusAssist = async (pemain: Pemain): Promise<any> => {
  const data = await prisma.pemain.update({where: {id: pemain.id}, data: {assist: pemain.assist - 1}})
  return data
}

export const minusGoal = async (pemain: Pemain): Promise<any> => {
  const data = await prisma.pemain.update({where: {id: pemain.id}, data: {goal: pemain.goal - 1}, include: {club: true}})
  await prisma.club.update({where: {id: data.club.id}, data: {goal: data.club.goal - 1, selisih: (data.club.goal - 1) - data.club.kebobolan }})
  return data
}

export const deletePemain = async (id: number): Promise<any> => {
  await prisma.pemain.delete({where: {id}})
  return "OK"
}