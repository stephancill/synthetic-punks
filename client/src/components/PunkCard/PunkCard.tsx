import { useAccount, useContractRead, useContractWrite, useEnsLookup, useProvider, useSigner, useWaitForTransaction } from "wagmi"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { truncateAddress } from "../../utilities"
import { PunkDetail } from "../PunkDetail/PunkDetail"
import { AddressTypeTag } from "../AddressTypeTag/AddressTypeTag"
import { useSyntheticPunks } from "../../hooks/useSyntheticPunks"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { BigNumber, ethers, Wallet } from "ethers"
import { Search } from "../Search/Search"

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
    console.log("claimMessage changed", claimMessage)
    readClaimMessageHash()
  // eslint-disable-next-line
  }, [claimMessage])

  useEffect(() => {
    console.log("tokenClaimed changed", tokenClaimed)
  }, [tokenClaimed])

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
    navigate({pathname: `/address/${wallet.address}`})
  }

  const onSearch = (checksummedAddress: string) => {
    if (checksummedAddress !== address) {
      setRandomWallet(undefined)
      navigate({pathname: `/address/${checksummedAddress}`})
    }
  }

  const addressOrEns = loadingEns ? address ? truncateAddress(address) : undefined : ensName ? ensName : address ? truncateAddress(address) : undefined

  return <div>
    <div>
      <Search onSearch={onSearch}/>
      {signer && <button onClick={() => onGenerateRandom()}>Random</button>}
    </div>
    <span>{addressOrEns}</span>
    <AddressTypeTag addressType={addressType}/>
    {address && <div>
      <PunkDetail address={address}></PunkDetail>
      {signer && <ClaimButton 
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
        />}
    </div>}
    
  </div>
}