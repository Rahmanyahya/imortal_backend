import { prisma } from "../db/db";

export const checkUser = async (username: string) => {
  return await prisma.user.findFirst({
    where: {
      username
    }
  })
} 
