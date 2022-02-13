export {attributes, ranges, render_order as renderOrder} from "./spritesheet-filtered.json"
import { attributes } from "./spritesheet-filtered.json"

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

export const spritesheet: Array<ISprite> = (attributes as any[]).map(row => {
    const [id, name, gender, size] = row
    const sprite = {
        id: id, name, gender, size
    }
    return sprite
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

