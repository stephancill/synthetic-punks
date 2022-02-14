import { AddressType } from "../PunkCard/PunkCard"
import searchSmall from "../../img/searchSmall.svg"
import diceSmall from "../../img/diceSmall.svg"
import style from "./AddressTypeTag.module.css"
export const AddressTypeTag = ({addressType}: {addressType: AddressType}) => {
  const options = {
    [AddressType.Signer]: <>You</>, 
    [AddressType.Random]: <img src={diceSmall} style={{width:"18px"}}></img>, 
    [AddressType.Search]: <img src={searchSmall} style={{width:"14px",marginTop:"1px"}}></img>
  }
  return <span className={style.tag}>{options[addressType]}</span> 
}