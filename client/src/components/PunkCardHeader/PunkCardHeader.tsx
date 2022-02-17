import { AddressTypeTag } from "../AddressTypeTag/AddressTypeTag"
import { AddressType } from "../PunkCard/PunkCard"
import twitter from "../../img/twitter.svg"
import style from "./PunkCardHeader.module.css"
import { truncateAddress } from "../../utilities"
import { useEnsLookup } from "wagmi"
import { isAddress } from "ethers/lib/utils"
import { ethers } from "ethers"
import { useEffect } from "react"

interface IPunkCardHeaderProps {
  address?: string
  addressType: AddressType
  ownerAddress?: string
  onTwitterShare: () => void
}
const copyAddress = (address: string | undefined) => {
  if (address) {
    navigator.clipboard.writeText(address);
  }
}
export const PunkCardHeader = ({address, addressType, ownerAddress, onTwitterShare}: IPunkCardHeaderProps) => {
  const [{ data: ensName }, lookupEns] = useEnsLookup({address})
  const [{ data: ownerEnsName }, lookupOwnerEns] = useEnsLookup({address: ownerAddress})

  // useEffect(() => {
  //   lookupEns()
  // }, [address])

  // useEffect(() => {
  //   lookupOwnerEns()
  // }, [ownerAddress])

  return <div>
    <div style={{display: "flex"}}>
      
      <h1  onClick={()=> copyAddress(address)} title={address} style={{display: "inline-block",cursor:"copy"}}>{ensName ? ensName : address ? truncateAddress(address) : ""}</h1>
      <AddressTypeTag addressType={addressType} />
      <button className={style.twitterButton} onClick={onTwitterShare} ><img src={twitter} alt="Twitter"></img></button>
    </div>
    {ownerAddress && isAddress(ownerAddress) && ethers.constants.AddressZero !== ownerAddress &&
      <p title={ownerAddress} onClick={()=> copyAddress(address)} style={{cursor:"copy"}}>Owned by {ownerEnsName ? ownerEnsName : truncateAddress(ownerAddress)}</p>
    }
  </div> 
}