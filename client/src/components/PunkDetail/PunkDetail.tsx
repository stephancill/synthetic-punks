import { Punk } from "../Punk/Punk"
import { useEffect, useState } from "react"
import { useAccount, useContract, useContractRead, useContractWrite, useProvider, useSigner } from "wagmi"
import { useSyntheticPunks } from "./../../hooks/useSyntheticPunks"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { getAttributeName } from "../../../../lib"

import style from "./PunkDetail.module.css"

interface IPunkDetailProps {
  address: string
}

export const PunkDetail = ({address}: IPunkDetailProps) => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  
  const syntheticPunks = useSyntheticPunks(signer || provider)
  const syntheticPunksConfig = useContractAdapter(syntheticPunks)

  const [{ data: tokenURI, loading: tokenURILoading, error: tokenURIError }, readTokenURI] = useContractRead(
    syntheticPunksConfig,
    '_tokenURI',
    {args: [address]}
  ) 

  const [{ data: attributeIds, loading: attributesLoading, error: attributesError }, readAttributeIds] = useContractRead(
    syntheticPunksConfig,
    '_getAttributes',
    {args: [address]}
  ) 

  const [imageData, setImageData] = useState<string | undefined>()
  useEffect(() => {
    if (tokenURI) {
      setImageData((JSON.parse(atob(tokenURI.split(",")[1])) as any).image)
    }
  }, [tokenURI])

  const [attributeNames, setAttributeNames] = useState<string[] | undefined>()
  useEffect(() => {
    if (attributeIds) {
      console.log(attributeIds)
      const attributeNames = attributeIds.map(id => getAttributeName(id.toNumber())!)
      setAttributeNames(attributeNames)
    }
  }, [attributeIds])

  const loading = attributesLoading || tokenURILoading
  const error = tokenURIError || attributesError
  
  if (error) {
    return <div>
      {error.message}
    </div>
  }
  
  return (
    <div>
      {loading 
      ? 
        <div>Loading...</div> 
      :  
        <div>
          <Punk imageData={imageData!}></Punk>
          <div style={{display:"flex", flexWrap: "wrap", width: "350px", justifyContent: "left", marginLeft:"21px",marginTop:"5px",marginBottom:"25px"}}>
            {attributeNames?.map((attributeName, i) => {
              return <div key={i} className={style.atrribute }>{attributeName}</div>
            })}
          </div>
        </div> 
      }
    </div>
  )
}