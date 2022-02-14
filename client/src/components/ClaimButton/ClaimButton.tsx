import { BigNumber, ethers } from "ethers"

interface IClaimedButtonProps {
  address: string
  claimable: boolean
  isRandom: boolean
  claimPrice?: BigNumber
  claimed?: boolean
  txHash?: string
  onClaim: () => void
  onClaimOther: () => void
}

export const ClaimButton = ({address, claimable, isRandom, claimed, txHash, claimPrice, onClaim, onClaimOther}: IClaimedButtonProps) => {
  // if not claimed and not claimable, nothing
  if (!claimed && !claimable) {
    return <></>
  }
  
  // if claimed, view on opensea
  if (claimed) {
    return <button>View on marketplace</button>
  }

  // if there is a transaction hash, open etherscan
  if (txHash) {
    return <button>View pending transaction</button>
  }

  // if not claimed and claimable, claim
  if (!claimed && claimable) {
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