import spritesheet from "../../punks.spritesheet/spritesheet.png"

interface IPunkProps {
  address: string
}


export const Punk = ({address}: IPunkProps) => {
  const scale = 10
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

  const getSprite = (x: number, y: number) => {
    ctx!.drawImage(sprite, x * size, y * size, size, size, 0, 0, size, size)
    return canvas.toDataURL("image/png")
  }

  return (
    <div>
      <div>Punk {address}</div>
      <div>
        <img src={spritesheet} />
        <img src={getSprite(20, 20)}></img>
      </div>
    </div>
  )  
}