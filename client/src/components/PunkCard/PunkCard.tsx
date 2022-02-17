import { useAccount, useContractRead, useContractWrite, useProvider, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
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
  Random,
  Owner
}

export const PunkCard = () => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const [randomWallet, setRandomWallet] = useState<Wallet | undefined>()
  const {address: rawAddress} = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const address = rawAddress ? isAddress(rawAddress.toLowerCase()) ? getAddress(rawAddress.toLowerCase()) : undefined : undefined

  const syntheticPunks = useSyntheticPunks(signer || provider)
  const syntheticPunksConfig = useContractAdapter(syntheticPunks)

  const [currentTx, setCurrentTx] = useState<ethers.providers.TransactionResponse | undefined>()

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

  const [{ data: ownerAddress }, readOwnerAddress] = useContractRead(
    syntheticPunksConfig,
    "ownerOf",
    {args: [tokenId]}
  ) 

  const [, claim] = useContractWrite(
    syntheticPunksConfig,
    "claim",
    {overrides: {value: claimPrice}}
  )

  const [, claimOther] = useContractWrite(
    syntheticPunksConfig,
    "claimOther"
  )

  const signerCanClaim = address === account?.address || address === randomWallet?.address
  const addressType = (account?.address && (account?.address === ownerAddress as any as string)) ? AddressType.Owner : randomWallet?.address === address ? AddressType.Random : account?.address === address ? AddressType.Signer : AddressType.Search

  useEffect(() => {
    readTokenClaimed()
    readOwnerAddress()
  // eslint-disable-next-line
  }, [address, currentTx, provider, tokenId])

  useEffect(() => {
    if (!signer) {
      setRandomWallet(undefined)
    }
  }, [signer])

  useEffect(() => {
    if (currentTx) {
      (async () => {
        console.log("new tx", currentTx.hash)
        await currentTx.wait(2)
        console.log("tx done")
        setCurrentTx(undefined)
      })()
    }
  }, [currentTx]) 

  useEffect(() => {
    readClaimMessageHash()
  // eslint-disable-next-line
  }, [claimMessage])

  const onClaim = () => {
    claim().then(({data: tx}) => setCurrentTx(tx))
  }

  const onClaimRandom = () => {
    if (!claimMessage || !randomWallet || !claimMessageHash) {
      return
    }
    
    randomWallet.signMessage(ethers.utils.arrayify(claimMessageHash)).then(signature => {
      claimOther({args: [randomWallet.address, signature], overrides: {value: claimPrice}}).then(({data: tx}) => setCurrentTx(tx))
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


  return <div style={{width: "90%", maxWidth: "400px"}}>
    <div style={{display: "flex", marginBottom: "30px", height: "50px"}}>
      <Search onSearch={onSearch}/>
      {signer && <button className={style.randomButton} onClick={() => onGenerateRandom()}><img src={dice} alt="Random"/></button>}
    </div>
    <div className={style.punkCard}>
      <div className={style.punkCardContent}>
        <PunkCardHeader address={address} addressType={addressType} ownerAddress={ownerAddress as any as string} onTwitterShare={onTwitterShare}/>
        {address && <div>
          <PunkDetail address={address}></PunkDetail>
          {provider && !(!tokenClaimed && !signerCanClaim) && <div style={{paddingBottom: "6px", marginTop: "20px"}}>
            <ClaimButton 
              address={address} 
              claimPrice={claimPrice ? claimPrice as any as BigNumber : undefined}
              isRandom={randomWallet !== undefined}
              signerCanClaim={signerCanClaim} 
              claimed={tokenClaimed as any as boolean}
              tokenId={tokenId as any as BigNumber} 
              txHash={currentTx?.hash}
              onClaim={onClaim}
              onClaimOther={onClaimRandom}
              />
          </div>}
        </div>}
      </div>
    </div>
  </div>
}