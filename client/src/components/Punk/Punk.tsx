import spritesheet from "../../punks.spritesheet/spritesheet.png"
import {
  rangeRenderOrder,
  attributeRanges,
  typesRange,
  isInRange,
  ISprite,
  getAllInRangeWithCriteria
} from "../../punks.spritesheet/spritesheet-csv"
import { useEffect, useState } from "react"

interface IPunkProps {
  address: string
}


export const Punk = ({address}: IPunkProps) => {
  const [imageData, setImageData] = useState("")
  const [attributes, setAttributes] = useState<Array<ISprite>>([])

  const scale = 5
  const size = 24
  const scaledSize = size * scale
  
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = scaledSize
  
  const ctx = canvas.getContext("2d")
  ctx!.scale(scale, scale)
  ctx!.imageSmoothingEnabled = false
  
  const sprite = new Image()
  sprite.src = spritesheet

  sprite.onload = () => {} // Chrome workaround

  useEffect(() => {
    generatePunk()
  }, [])

  const drawSprite = (id: number) => {
    const x = id % 25
    const y = Math.floor(id / 25)
    ctx!.drawImage(sprite, x * size, y * size, size, size, 0, 0, size, size)
    return canvas.toDataURL("image/png")
  }

  const getAttributeCount = () => {
    return Math.floor(Math.random() * 8)
  }

  const getGender = () => {
    return Math.random() > 0.5 ? "m" : "f"
  }

  const getBaseType = (gender: string) => {
    return chooseRandom(getAllInRangeWithCriteria(typesRange, [gender, "u"]), 1)[0] as ISprite
  }

  const chooseRandom = (arr: Array<any>, num = 1) => {
    const res = []
    for(let i = 0; i < num; ){
       const random = Math.floor(Math.random() * arr.length)
       if(res.indexOf(arr[random]) !== -1){
          continue
       };
       res.push(arr[random])
       i++
    }
    return res
  }

  const generatePunk = () => {
    ctx!.clearRect(0, 0, size, size)
    
    const numAttributes = getAttributeCount()
    const gender = getGender()
    const baseType = getBaseType(gender)
    const selectedAttributeTypes = chooseRandom(Object.values(attributeRanges), numAttributes)

    let _attributes = selectedAttributeTypes.map(range => {
      const options = getAllInRangeWithCriteria(range, [gender, "u"], [gender === "f" ? "s" : "l"])
      return chooseRandom(options)[0] as ISprite
    }).filter(attr => attr !== undefined)

    rangeRenderOrder.forEach(range => {
      [baseType, ..._attributes].forEach(sprite => {
        if (isInRange(sprite.id, range)) {
          drawSprite(sprite.id)
        }
      })
    })

    setAttributes([baseType, ..._attributes])
    setImageData(canvas.toDataURL("image/png"))
  }


  return (
    <span style={{display: "inline-block"}}>
      {/* <div>Punk {address}</div>
      <button onClick={() => generatePunk()}>Random</button> */}
      <span>
        <img src={imageData}></img>
        {/* {attributes.map(attr => <div key={attr.id}>{attr.name}</div>)} */}
      </span>
    </span>
  )  
}