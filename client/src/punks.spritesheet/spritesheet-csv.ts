function CSVToArray( strData: string, strDelimiter: string ){
  strDelimiter = (strDelimiter || ",");
  const arrData: string[][] = []
  const lines = strData.split("\n")
  for (let i = 0; i < lines.length; i++) {
      const row = lines[i].split(strDelimiter);
      arrData.push(row)
  }
  return( arrData );
}
// id, name, gender, size, type, more_names
export const descriptor = `5, Human 1, m, l, Archetype - Human, Human Male 1 | Human 1 ♂ | Male 1 | Man 1 | ♂ 1
6, Human 2, m, l, Archetype - Human, Human Male 2 | Human 2 ♂ | Male 2 | Man 2 | ♂ 2
7, Human 3, m, l, Archetype - Human, Human Male 3 | Human 3 ♂ | Male 3 | Man 3 | ♂ 3
8, Human 4, m, l, Archetype - Human, Human Male 4 | Human 4 ♂ | Male 4 | Man 4 | ♂ 4
22, Human Female 1, f, s, Archetype - Human, Human 1 ♀ | Female 1 | Woman 1 | Lady 1 | ♀ 1
23, Human Female 2, f, s, Archetype - Human, Human 2 ♀ | Female 2 | Woman 2 | Lady 2 | ♀ 2
24, Human Female 3, f, s, Archetype - Human, Human 3 ♀ | Female 3 | Woman 3 | Lady 3 | ♀ 3
25, Human Female 4, f, s, Archetype - Human, Human 4 ♀ | Female 4 | Woman 4 | Lady 4 | ♀ 4
30, Zombie, m, l, Archetype - Zombie, Zombie Male | Zombie ♂
34, Ape, m, l, Archetype - Ape, Ape Male | Ape ♂
39, Alien, m, l, Archetype - Alien, Alien Male | Alien ♂
240, 3D Glasses, u, l, Attribute, 
241, 3D Glasses, f, s, Attribute, 
242, Big Shades, u, l, Attribute, 
243, Big Shades, f, s, Attribute, 
244, Classic Shades, u, l, Attribute, 
245, Classic Shades, f, s, Attribute, 
246, Eye Mask, u, l, Attribute, 
247, Eye Mask, f, s, Attribute, 
248, Eye Patch, u, l, Attribute, 
249, Eye Patch, f, s, Attribute, 
250, Horned Rim Glasses, u, l, Attribute, 
251, Horned Rim Glasses, f, s, Attribute, 
252, Nerd Glasses, u, l, Attribute, 
253, Nerd Glasses, f, s, Attribute, 
254, Regular Shades, u, l, Attribute, 
255, Regular Shades, f, s, Attribute, 
256, Small Shades, u, l, Attribute, 
257, Small Shades, f, s, Attribute, 
258, VR, u, l, Attribute, 
259, VR, f, s, Attribute, 
260, Welding Goggles, f, s, Attribute, 
271, Blue Eye Shadow, f, s, Attribute, 
272, Green Eye Shadow, f, s, Attribute, 
273, Green Eye Shadow, f, l, Attribute, 
275, Clown Eyes Blue, u, l, Attribute, 
276, Clown Eyes Blue, f, s, Attribute, 
277, Clown Eyes Green, u, l, Attribute, 
278, Clown Eyes Green, f, s, Attribute, 
281, Mole, m, l, Attribute, 
282, Mole, f, s, Attribute, 
283, Rosy Cheeks, m, l, Attribute, 
284, Rosy Cheeks, f, s, Attribute, 
285, Spots, m, l, Attribute, 
286, Spots, f, s, Attribute, 
287, Clown Nose, u, l, Attribute, Clown Nose Red
288, Clown Nose, f, s, Attribute, Clown Nose Red
293, Earring, u, l, Attribute, Gold Earring
294, Earring, f, s, Attribute, Gold Earring
297, Buck Teeth, m, l, Attribute, 
298, Frown, m, l, Attribute, 
299, Smile, m, l, Attribute, 
300, Black Lipstick, f, u, Attribute, 
301, Hot Lipstick, f, u, Attribute, 
302, Purple Lipstick, f, u, Attribute, 
305, Cigarette, u, l, Attribute, 
306, Cigarette, f, s, Attribute, 
307, Medical Mask, u, l, Attribute, 
308, Medical Mask, f, s, Attribute, 
309, Pipe, u, l, Attribute, 
310, Pipe, f, s, Attribute, 
311, Vape, u, l, Attribute, 
312, Vape, f, s, Attribute, 
317, Choker, f, u, Attribute, 
318, Gold Chain, m, l, Attribute, 
319, Gold Chain, f, u, Attribute, 
320, Silver Chain, m, l, Attribute, 
321, Silver Chain, f, u, Attribute, 
324, Big Beard, m, l, Attribute, 
325, Chinstrap, m, l, Attribute, 
326, Front Beard, m, l, Attribute, 
327, Front Beard Dark, m, l, Attribute, 
328, Goat, m, l, Attribute, 
329, Handlebars, m, l, Attribute, 
330, Luxurious Beard, m, l, Attribute, 
331, Mustache, m, l, Attribute, 
332, Muttonchops, m, l, Attribute, 
333, Normal Beard, m, l, Attribute, 
334, Normal Beard Black, m, l, Attribute, 
335, Shadow Beard, m, l, Attribute, 
336, Bandana, m, l, Attribute, 
337, Bandana, f, s, Attribute, 
338, Beanie, m, l, Attribute, 
339, Beanie, f, s, Attribute, 
340, Cap Forward, u, l, Attribute, 
341, Cap Forward, f, s, Attribute, 
342, Cowboy Hat, m, l, Attribute, 
343, Cowboy Hat, f, s, Attribute, 
344, Do-rag, m, l, Attribute, 
345, Do-rag, f, s, Attribute, 
346, Fedora, m, l, Attribute, Fedora 1
347, Fedora, f, s, Attribute, Fedora 1
348, Headband, u, l, Attribute, 
349, Headband, f, s, Attribute, 
350, Hoodie, m, l, Attribute, 
351, Hoodie, f, s, Attribute, 
352, Knitted Cap, u, l, Attribute, 
353, Knitted Cap, f, s, Attribute, 
354, Pilot Helmet, f, s, Attribute, 
355, Police Cap, m, l, Attribute, 
356, Police Cap, f, s, Attribute, 
357, Tassle Hat, f, s, Attribute, 
358, Tiara, f, s, Attribute, 
359, Top Hat, m, l, Attribute, 
360, Top Hat, f, s, Attribute, 
461, Cap, u, l, Attribute, 
462, Cap, f, s, Attribute, 
487, Blonde Short, f, s, Attribute, 
488, Crazy Hair, m, l, Attribute, 
489, Crazy Hair, f, s, Attribute, 
490, Crazy Hair, f, l, Attribute, 
491, Dark Hair, f, s, Attribute, 
492, Frumpy Hair, m, l, Attribute, 
493, Frumpy Hair, f, s, Attribute, 
494, Half Shaved, f, s, Attribute, 
495, Messy Hair, u, l, Attribute, 
496, Messy Hair, f, s, Attribute, 
497, Mohawk, u, l, Attribute, 
498, Mohawk, f, s, Attribute, 
499, Mohawk Dark, u, l, Attribute, 
500, Mohawk Dark, f, s, Attribute, 
501, Mohawk Thin, u, l, Attribute, 
502, Mohawk Thin, f, s, Attribute, 
503, Orange Side, f, s, Attribute, 
504, Peak Spike, m, l, Attribute, 
505, Pigtails, f, s, Attribute, 
506, Pink With Hat, f, s, Attribute, 
507, Purple Hair, m, l, Attribute, 
508, Purple Hair, f, s, Attribute, 
509, Red Mohawk, f, s, Attribute, 
510, Shaved Head, m, l, Attribute, 
511, Shaved Head, f, s, Attribute, 
512, Straight Hair, f, s, Attribute, 
513, Straight Hair Blonde, f, s, Attribute, 
514, Straight Hair Dark, f, s, Attribute, 
515, Stringy Hair, m, l, Attribute, 
516, Stringy Hair, f, s, Attribute, 
517, Vampire Hair, m, l, Attribute, 
518, Wild Blonde, f, s, Attribute, 
519, Wild Hair, m, l, Attribute, 
520, Wild Hair, f, s, Attribute, 
521, Wild Hair, f, l, Attribute, 
522, Wild White Hair, f, s, Attribute, 
602, Blonde Bob, f, l, Attribute, 
603, Blonde Bob, f, s, Attribute, 
649, Clown Hair Green, m, l, Attribute, 
664, Clown Hair Green, f, s, Attribute,`

export interface ISprite {
    id: number 
    name: string
    gender: string 
    size: string
    type: string
    moreNames: string
}

export interface ISpriteCriteria {
    id?: number 
    name?: string
    gender?: string 
    size?: string
    type?: string
    moreNames?: string
}

export interface IRange {
    startId: number
    endId: number
}

const spritesheetRaw = CSVToArray(descriptor, ", ")
const fields = ["id", "name", "gender", "size", "type", "more_names"]
export const spritesheet: Array<ISprite> = spritesheetRaw.map(row => {
    const [id, name, gender, size, type, moreNames] = row
    console.log(row)
    return {
        id: parseInt(id), name, gender, size, type, moreNames
    }
})

export const typesRange: IRange = {startId: 5, endId: 39}
export const eyesRange: IRange = {startId: 240, endId: 278}
export const cheeksRange: IRange = {startId: 281, endId: 288}
export const earsRange: IRange = {startId: 293, endId: 294}
export const teethRange: IRange = {startId: 297, endId: 297}
export const mouthRange: IRange = {startId: 299, endId: 302}
export const mouthAccessoriesRange: IRange = {startId: 305, endId: 317}
export const neckRange: IRange = {startId: 317, endId: 321}
export const beardsRange: IRange = {startId: 324, endId: 335}
export const headAccessoriesRange: IRange = {startId:  336, endId: 664}

export const attributeRanges = {
    eyesRange,
    cheeksRange,
    earsRange,
    teethRange,
    mouthRange,
    mouthAccessoriesRange,
    neckRange,
    beardsRange,
    headAccessoriesRange,
}

export const getRange = (range: IRange) => {
    return spritesheet.filter(sprite => sprite.id >= range.startId && sprite.id <= range.endId)
}

export const getAllInRangeWithCriteria = (range: IRange, genders?: Array<string>, sizes?: Array<string>) => {
    return spritesheet.filter(sprite => {
        return (sprite.id >= range.startId && sprite.id <= range.endId) && (
            sizes?.includes(sprite.size) || genders?.includes(sprite.gender)
        )
    })
}

