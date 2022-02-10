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

interface IPunk {
  attributes: Array<string>
  imageData: string
}

export const Punk = ({address, signerOrProvider}: IPunkProps) => {
  const [punk, setPunk] = useState<IPunk | undefined>(undefined)
  // const [imageData, setImageData] = useState("")
  // const [attributes, setAttributes] = useState<Array<string>>([])
  const [isLoading, setIsLoading] = useState(false)
  const syntheticPunks = useSyntheticPunks(signerOrProvider instanceof Signer ? signerOrProvider.provider! : signerOrProvider as BaseProvider)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const b64Metadata = await syntheticPunks._tokenURI(address)
        const _imageData = (JSON.parse(atob(b64Metadata.split(",")[1])) as any).image
        const attributeIds = await syntheticPunks._getAttributes(address)
        const attributeNames = attributeIds.map(id => getAttributeName(id.toNumber())).filter(name => name !== undefined) as any as Array<string>
        setPunk({imageData: _imageData, attributes: attributeNames})
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    })()
  }, [address, signerOrProvider])

  return (
    <div style={{display: "inline-block", paddingTop:"0px", width: "500px"}}>
      {isLoading && <div>Loading...</div>}
      
      {punk && !isLoading && <>
      <div>
        <img style={{width: "400px", border: "1px black solid", background:"#6A9480", borderRadius:"5px"}} src={punk.imageData}></img>
      </div>
      {punk.attributes.length > 0 && 
      <div style={{display:"flex", flexWrap: "wrap", width: "100%", justifyContent: "center"}}>
        {punk.attributes.map((attribute, i) => {
          return <div key={i} className={style.atrributes }>{attribute}</div>
        })}
      </div>
      }
      </>
    }
    </div>
  )  
}