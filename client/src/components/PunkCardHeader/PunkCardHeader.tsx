import { AddressTypeTag } from "../AddressTypeTag/AddressTypeTag"
import { AddressType } from "../PunkCard/PunkCard"
import twitter from "../../img/twitter.svg"
import style from "./PunkCardHeader.module.css"

interface IPunkCardHeaderProps {
  addressOrEns?: string
  addressType: AddressType
  onTwitterShare: () => void
}

export const PunkCardHeader = ({addressOrEns, addressType, onTwitterShare}: IPunkCardHeaderProps) => {
  return <div style={{display: "flex"}}>
  <h1 style={{display: "inline-block"}}>{addressOrEns}</h1>
  <AddressTypeTag addressType={addressType}/>
  <button className={style.twitterButton} onClick={onTwitterShare}><img src={twitter}></img></button>
</div>
}