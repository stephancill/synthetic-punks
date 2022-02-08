import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Signer } from "ethers"
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import deployments from "./../../deployments.json"

interface IPunkProps {
  address: string
  signerOrProvider: Signer | BaseProvider
}

export const Punk = ({address, signerOrProvider}: IPunkProps) => {
  const [imageData, setImageData] = useState("")

  useEffect(() => {
    const contractAddress = deployments.contracts["SyntheticPunks"].address // TODO: Use mainnet deployment
    const contractInterface = new ethers.utils.Interface( deployments.contracts["SyntheticPunks"].abi)
    console.log(signerOrProvider)
    const contract = new ethers.Contract(contractAddress, contractInterface, signerOrProvider);
    (async () => {
      console.log("loading")
      const b64Metadata = await contract._tokenURI(address)
      const _imageData = (JSON.parse(atob(b64Metadata.split(",")[1])) as any).image
      console.log("done")
      setImageData(_imageData)
    })()
  }, [address, signerOrProvider])

  return (
    <div style={{display: "inline-block"}}>
      <div>{address}</div>
      <span>
        <img style={{width: "500px", border: "1px black solid"}} src={imageData}></img>
        {/* {attributes.map(attr => <div key={attr.id}>{attr.name}</div>)} */}
      </span>
    </div>
  )  
}