import { BigNumber, BigNumberish, ethers } from "ethers"
import deployments from "../../deployments.json"

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
    return <a href={`https://opensea.io/assets/${deployments.contracts.SyntheticPunks.address}/${tokenId.toString()}` }target="_blank"><button>View on marketplace</button></a> 
  }

  // if there is a transaction hash, open etherscan
  if (txHash) {
    return <a href={`https://etherscan.io/tx/${txHash}`} target="_blank"><button>View pending transaction</button></a> 
  }

  // if not claimed and claimable, claim
  if (signerCanClaim && !claimed) {
    if (!claimPrice) {
      return <button disabled={true}>Loading...</button>
    } else {
      if (!isRandom) {
        return <button onClick={() => onClaim()}>Claim {ethers.utils.formatEther(claimPrice)}</button>
      } else {
        return <div>
          <div>
            <button onClick={() => onClaimOther()}>Claim {ethers.utils.formatEther(claimPrice)}</button>
          </div>
          <div>
          You can claim this because you have generated the wallet associated with this punk

          </div>
        </div> 
      }
    }
  }

  return <></>
  
}