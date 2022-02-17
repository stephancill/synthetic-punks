import { AddressType } from "../PunkCard/PunkCard"
import searchSmall from "../../img/searchSmall.svg"
import diceSmall from "../../img/diceSmall.svg"
import style from "./AddressTypeTag.module.css"
export const AddressTypeTag = ({addressType}: {addressType: AddressType}) => {
  const options = {
    [AddressType.Signer]: <>You</>, 
    [AddressType.Owner]: <>Yours</>,
    [AddressType.Random]: <img alt="Random" src={diceSmall} style={{width:"16px", marginTop: "1px"}}></img>, 
    [AddressType.Search]: <img alt="Search" src={searchSmall} style={{width:"14px", marginTop: "2px"}}></img>,
  }
  return <span className={style.tag}><span className={style.content}>{options[addressType]}</span></span> 
}