import { BigNumber, ethers } from "ethers"
import deployments from "../../deployments.json"
import style from "./ClaimButton.module.css"
import opensea from "../../img/opensea.svg"
import { SpinnerCircular } from 'spinners-react'

interface IClaimedButtonProps {
  address: string
  signerCanClaim: boolean
  isRandom: boolean
  claimPrice?: BigNumber
  tokenId?: BigNumber
  claimed?: boolean
  txHash?: string
  onClaim: () => void
  onClaimOther: () => void
}

export const ClaimButton = ({signerCanClaim, claimed, isRandom, tokenId, txHash, claimPrice, onClaim, onClaimOther}: IClaimedButtonProps) => {
  // TODO: icons
  
  // if not claimed and not claimable, nothing
  if (!claimed && !signerCanClaim) {
    return <></>
  }
  
  // if claimed, view on opensea
  if (claimed && tokenId) {
    return <a href={`https://opensea.io/assets/${deployments.contracts.SyntheticPunks.address}/${tokenId.toString()}`}
    target="_blank" rel="noreferrer"><button className={style.claimButton}>View on marketplace <img style={{height: "20px", marginLeft: "10px"}} src={opensea} alt=""/></button></a> 
  }

  // if there is a transaction hash, open etherscan
  if (txHash) {
    return <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">
      <button className={style.claimButton}>View pending transaction</button>
    </a> 
  }

  // if not claimed and claimable, claim
  if (signerCanClaim && !claimed) {
    if (!claimPrice) {
      return <button className={style.claimButton} disabled={true}>Loading...</button>
    } else {
      if (!isRandom) {
        return <button className={style.claimButton} onClick={() => onClaim()}>Claim {ethers.utils.formatEther(claimPrice)} ♦</button>
      } else {
        return <div style={{display:"flex"}}>
          <button className={style.claimButton} onClick={() => onClaimOther()}>Claim {ethers.utils.formatEther(claimPrice)} ♦</button>
          <button className={`${style.helpBtn} ${style.toolTip}`}>?
            <span className={style.toolTipText}>You may claim this punk and have it sent to your connected wallet </span>
          </button>
        </div> 
      }
    }
  }

  return <></>
  
}