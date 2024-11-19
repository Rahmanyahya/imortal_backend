import bcrypt from "bcrypt";
import { prisma } from "../db/db";

async function main () {
    await prisma.user.create({
        data: {
           username: "MokletHebat2024",
           password: await bcrypt.hash("mokletximortalcup2024", 10),
        }
    })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("user created")
        await prisma.$disconnect();
    });