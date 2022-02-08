import {csv as descriptor} from "./spritesheet-filtered.json"

function CSVToArray( strData: string, strDelimiter: string ){
  strDelimiter = (strDelimiter || ",");
  const arrData: string[][] = []
  const lines = strData.split("\n")
  for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(strDelimiter);
      arrData.push(row)
  }
  return( arrData );
} 

export interface ISprite {
    id: number 
    name: string
    gender: string 
    size: string
}

export interface IRange {
    startId: number
    endId: number
}

const spritesheetRaw = CSVToArray(descriptor, ",")
export const spritesheet: Array<ISprite> = spritesheetRaw.map(row => {
    const [id, name, gender, size] = row
    return {
        id: parseInt(id), name, gender, size
    }
})

// TODO: use calculated ranges
export const typesRange: IRange = {startId: 0, endId: 10}
export const eyesRange: IRange = {startId: 11, endId: 37}
export const cheeksRange: IRange = {startId: 38, endId: 45}
export const earsRange: IRange = {startId: 46, endId: 47}
export const mouthRange: IRange = {startId: 48, endId: 50}
export const mouthAccessoriesRange: IRange = {startId: 51, endId: 58}
export const neckRange: IRange = {startId: 59, endId: 60}
export const beardsRange: IRange = {startId: 61, endId: 72}
export const headAccessoriesRange: IRange = {startId:  73, endId: 136}
export const attributeRanges = {
    eyesRange,
    cheeksRange,
    earsRange,
    mouthRange,
    neckRange,
    beardsRange,
    headAccessoriesRange,
    mouthAccessoriesRange,
}
export const rangeRenderOrder = [
    typesRange,
    eyesRange,
    cheeksRange,
    earsRange,
    mouthRange,
    neckRange,
    beardsRange,
    headAccessoriesRange,
    mouthAccessoriesRange,
]

export {ranges, render_order as renderOrder} from "./spritesheet-filtered.json"

export const isInRange = (id: number, range: IRange) => {
    return id >= range.startId && id <= range.endId
}

export const getRange = (range: IRange) => {
    return spritesheet.filter(sprite => sprite.id >= range.startId && sprite.id <= range.endId)
}

export const getAllInRangeWithCriteria = (range: IRange, genders?: Array<string>, sizes?: Array<string>) => {
    return spritesheet.filter(sprite => {
        return (sprite.id >= range.startId && sprite.id <= range.endId) && (
            (sizes ? sizes.includes(sprite.size) : true) && (genders ? genders.includes(sprite.gender) : true)
        )
    })
}

