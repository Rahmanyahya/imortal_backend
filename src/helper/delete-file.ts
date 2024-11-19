import fs from "fs"
import { root_dir } from "../config/config"
export function deletePhoto (name: any, location: string) {
    const path = `${root_dir}/public/${location}/${name}`
    fs.unlinkSync(path)
}