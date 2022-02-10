import { useEffect, useState } from "react"
import { Signer } from "ethers"
import style from "./Punk.module.css"
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import { useSyntheticPunks } from "../../hooks/useSyntheticPunks"
import { getAttributeName } from "../../../../lib"

interface IPunkProps {
  address: string
  signerOrProvider: Signer | BaseProvider
  
}

export const Punk = ({address, signerOrProvider}: IPunkProps) => {
  const [imageData, setImageData] = useState("")
  const [attributes, setAttributes] = useState<Array<string>>([])
  const syntheticPunks = useSyntheticPunks(signerOrProvider instanceof Signer ? signerOrProvider.provider! : signerOrProvider as BaseProvider)

  useEffect(() => {
    (async () => {
      console.log("loading")
    try {
      const b64Metadata = await syntheticPunks._tokenURI(address)
      const _imageData = (JSON.parse(atob(b64Metadata.split(",")[1])) as any).image
      console.log("done")
      const attributeIds = await syntheticPunks._getAttributes(address)
      const attributeNames = attributeIds.map(id => getAttributeName(id.toNumber())).filter(name => name !== undefined) as any as Array<string>
      console.log(attributeNames)
      setAttributes(attributeNames)
      setImageData(_imageData)
    } catch (error) {
      console.log(error)
    }
    })()
  }, [address, signerOrProvider])

  return (
    <div style={{display: "inline-block", paddingTop:"0px"}}>
      <span>
        <div>
          <img style={{width: "400px", border: "1px black solid", background:"#6A9480", borderRadius:"5px"}} src={imageData}></img>
        </div>
        {attributes.length > 0 && 
        <div style={{display:"flex"}} id="hello">

          {attributes.map((attribute, i) => {
            return <div key={i} className={style.atrributes }>{attribute}</div>
          })}
        </div>
        }
      </span> 
    </div>
  )  
}