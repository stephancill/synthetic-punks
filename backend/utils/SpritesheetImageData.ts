import fs from "fs"
import { ranges as namedRanges, renderOrder } from  "../../lib"
const Hash = require("ipfs-only-hash")

export const spritesheetImageData = (() => {
  const bitmap = fs.readFileSync("../lib/punks.spritesheet/spritesheet.png")
  const imageData = `data:image/png;charset:utf-8;base64,${Buffer.from(bitmap).toString("base64")}`
  return imageData
})() 

export const attributesContentURI = (async (): Promise<string> => {
  const jsonFile = fs.readFileSync("../lib/punks.spritesheet/spritesheet-filtered.json") 
  const hash = await Hash.of(jsonFile)
  return `ipfs://${hash}`
})()

export const allRanges = renderOrder.map(category => (namedRanges as any)[category])