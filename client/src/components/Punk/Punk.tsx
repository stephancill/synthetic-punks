import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Signer } from "ethers"
import style from "./Punk.module.css"
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import deployments from "./../../deployments.json"

interface IPunkProps {
  address: string
  signerOrProvider: Signer | BaseProvider
  
}

export const Punk = ({address, signerOrProvider}: IPunkProps) => {
  const [imageData, setImageData] = useState("")
  const [showAtrributes, setShowAtrributes] = useState(false)


  useEffect(() => {
    const contractAddress = deployments.contracts["SyntheticPunks"].address // TODO: Use mainnet deployment
    const contractInterface = new ethers.utils.Interface( deployments.contracts["SyntheticPunks"].abi)
    console.log(signerOrProvider)
    const contract = new ethers.Contract(contractAddress, contractInterface, signerOrProvider);
    (async () => {
      console.log("loading")
      console.log(address)
      try {
        const b64Metadata = await contract._tokenURI(address)
        const _imageData = (JSON.parse(atob(b64Metadata.split(",")[1])) as any).image
        console.log("done")
        setImageData(_imageData)
      } catch (error) {
        console.log(error)
      }
      
    })()
  }, [address, signerOrProvider])

  const toggleShowAtrributes = () => {
    setShowAtrributes(!showAtrributes)
  }

  return (
    <div style={{display: "inline-block", paddingTop:"0px"}}>
      <span>
        <div>
          <img style={{width: "400px", border: "1px black solid", background:"#6A9480", borderRadius:"5px"}} src={imageData}></img>
        </div>
        <div>
         <button className={style.attributeBtn} onClick={()=>{toggleShowAtrributes()}}>Attributes</button>
        </div>
        {showAtrributes && 
        <div style={{display:"flex"}}>
          <div className={style.atrributes }>Coffee</div>
          <div className={style.atrributes }>Coffee</div>
          <div className={style.atrributes }>Coffee</div>
          <div className={style.atrributes }>Coffee</div>
          <div className={style.atrributes }>Coffee</div>
        </div>
        }
      </span> 
    </div>
  )  
}