import {csv as descriptor} from "./spritesheet-filtered.json"
export {ranges, render_order as renderOrder} from "./spritesheet-filtered.json"

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

export const getAttributeName = (id: number) => {
    return spritesheet.find(sprite => sprite.id === id)?.name
}

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

