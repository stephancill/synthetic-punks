import { useAccount, useContractRead, useContractWrite, useEnsLookup, useProvider, useSigner, useWaitForTransaction } from "wagmi"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { truncateAddress } from "../../utilities"
import { PunkDetail } from "../PunkDetail/PunkDetail"
import { useSyntheticPunks } from "../../hooks/useSyntheticPunks"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { BigNumber, ethers, Wallet } from "ethers"
import { Search } from "../Search/Search"
import { useLocation } from "react-router-dom"
import { PunkCardHeader } from "../PunkCardHeader/PunkCardHeader"
import dice from "../../img/dice.svg"
import style from "./PunkCard.module.css"

const {isAddress, getAddress} = ethers.utils

export enum AddressType {
  Search,
  Signer,
  Random
}

export const PunkCard = () => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const [randomWallet, setRandomWallet] = useState<Wallet | undefined>()
  const {address: rawAddress} = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const address = rawAddress ? isAddress(rawAddress) ? getAddress(rawAddress) : undefined : undefined
  const addressType = randomWallet?.address === address ? AddressType.Random : account?.address === address ? AddressType.Signer : AddressType.Search

  const [{ data: ensName, loading: loadingEns }] = useEnsLookup({address})

  const syntheticPunks = useSyntheticPunks(signer || provider)
  const syntheticPunksConfig = useContractAdapter(syntheticPunks)

  const [{ data: tokenClaimed }, readTokenClaimed] = useContractRead(
    syntheticPunksConfig,
    "claimed",
    {args: [address]}
  ) 

  const [{ data: tokenId }] = useContractRead(
    syntheticPunksConfig,
    "getTokenID",
    {args: [address]}
  ) 

  const [{ data: claimPrice }] = useContractRead(
    syntheticPunksConfig,
    "claimPrice",
  ) 

  const [{ data: claimMessage }] = useContractRead(
    syntheticPunksConfig,
    "claimMessage",
  ) 

  const [{ data: claimMessageHash }, readClaimMessageHash] = useContractRead(
    syntheticPunksConfig,
    "getMessageHash",
    {args: [claimMessage]}
  ) 

  const [{ data: claimTx }, claim] = useContractWrite(
    syntheticPunksConfig,
    "claim",
    {overrides: {value: claimPrice}}
  )

  const [{ data: claimOtherTx }, claimOther] = useContractWrite(
    syntheticPunksConfig,
    "claimOther"
  )

  const [{ loading: claimOtherLoading }] = useWaitForTransaction({
    hash: claimOtherTx?.hash,
    confirmations: 2
  })

  const [{ loading: claimLoading }] = useWaitForTransaction({
    hash: claimTx?.hash,
    confirmations: 2
  })

  const signerCanClaim = address === account?.address || address === randomWallet?.address

  useEffect(() => {
    readTokenClaimed()
  // eslint-disable-next-line
  }, [address, claimOtherLoading, claimLoading])

  useEffect(() => {
    readClaimMessageHash()
  // eslint-disable-next-line
  }, [claimMessage])

  const onClaim = () => {
    claim()
  }

  const onClaimRandom = () => {
    if (!claimMessage || !randomWallet || !claimMessageHash) {
      return
    }
    
    randomWallet.signMessage(ethers.utils.arrayify(claimMessageHash)).then(signature => {
      claimOther({args: [randomWallet.address, signature], overrides: {value: claimPrice}})
    })    
  }

  const onGenerateRandom = () => {
    const wallet = ethers.Wallet.createRandom()
    setRandomWallet(wallet)
    // TODO: This is not working
    navigate({pathname: `/address/${wallet.address}`})
  }

  const onSearch = (checksummedAddress: string) => {
    if (checksummedAddress !== address) {
      setRandomWallet(undefined)
      navigate({pathname: `/address/${checksummedAddress}`})
    }
  }

  const onTwitterShare = () => {
    const tweet = encodeURIComponent(`Check out my Synthetic CryptoPunk! @stephancill @npm_luko`)
    const ctaURL = encodeURIComponent(`https://syntheticpunks.com/#${location.pathname}`)
    const related = encodeURIComponent(`stephancill,npm_luko,larvalabs,lootproject`)
    const intentBaseURL = `https://twitter.com/intent/tweet`
    const intentURL = `${intentBaseURL}?text=${tweet}&url=${ctaURL}&related=${related}`
    window.open(intentURL, "_blank")
  }

  const addressOrEns = loadingEns ? address ? truncateAddress(address) : undefined : ensName ? ensName : address ? truncateAddress(address) : undefined

  return <div style={{width: "90%", maxWidth: "400px"}}>
    <div style={{display: "flex", marginBottom: "30px", height: "50px"}}>
      <Search onSearch={onSearch}/>
      {signer && <button className={style.randomButton} onClick={() => onGenerateRandom()}><img src={dice}/></button>}
    </div>
    <div className={style.punkCard}>
      <div className={style.punkCardContent}>
        <PunkCardHeader addressOrEns={addressOrEns} addressType={addressType} onTwitterShare={onTwitterShare}/>
        {address && <div>
          <PunkDetail address={address}></PunkDetail>
          {signer && signerCanClaim && <div style={{paddingBottom: "6px", marginTop: "20px"}}>
            <ClaimButton 
            address={address} 
            claimPrice={claimPrice ? claimPrice as any as BigNumber : undefined}
            isRandom={randomWallet !== undefined}
            signerCanClaim={signerCanClaim} 
            claimed={tokenClaimed as any as boolean}
            tokenId={tokenId as any as BigNumber} 
            txHash={ 
              (claimLoading && claimTx ? claimTx.hash : undefined) ||
              (claimOtherLoading && claimOtherTx ? claimOtherTx.hash : undefined)}
            onClaim={onClaim}
            onClaimOther={onClaimRandom}
            />
          </div> }
        </div>}
      </div>
    </div>
  </div>
}