import { useAccount, useContractRead, useContractWrite, useEnsLookup, useEnsResolveName, useProvider, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { truncateAddress } from "../../utilities"
import { PunkDetail } from "../PunkDetail/PunkDetail"
import { AddressTypeTag } from "../AddressTypeTag/AddressTypeTag"
import { useSyntheticPunks } from "../../hooks/useSyntheticPunks"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { BigNumber, ethers, Wallet } from "ethers"

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
  const [rawSearchQuery, setRawSearchQuery] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const {address: rawAddress} = useParams()
  const navigate = useNavigate()

  const address = rawAddress ? isAddress(rawAddress) ? getAddress(rawAddress) : undefined : undefined
  const addressType = randomWallet?.address === address ? AddressType.Random : account === address ? AddressType.Signer : AddressType.Search

  const [{ data: ensName }] = useEnsLookup({address})

  const [{ data: resolvedSearchQuery}, resolveSearchQuery] = useEnsResolveName({name: searchQuery})

  const syntheticPunks = useSyntheticPunks(signer || provider)
  const syntheticPunksConfig = useContractAdapter(syntheticPunks)

  const [{ data: tokenClaimed }, readTokenClaimed] = useContractRead(
    syntheticPunksConfig,
    "claimed",
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

  const [{ data: claimMessageHash }] = useContractRead(
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

  const claimable = address === account?.address || address === randomWallet?.address

  useEffect(() => {
    readTokenClaimed()
  // eslint-disable-next-line
  }, [address])

  useEffect(() => {
    const searchAddress = resolvedSearchQuery || searchQuery
    if (searchAddress && isAddress(searchAddress)) {
      const checksummed = getAddress(searchAddress)
      if (checksummed !== address) {
        setSearchQuery("")
        navigate({pathname: `/address/${checksummed}`})
      }
    }
  }, [searchQuery, resolvedSearchQuery, address, navigate])

  const onClaim = () => {
    claim()
  }

  const onClaimRandom = () => {
    if (!claimMessage || !randomWallet || !claimMessageHash) {
      return
    }
    const signature = randomWallet.signMessage(ethers.utils.arrayify(claimMessageHash))
    claimOther({args: [randomWallet.address, signature], overrides: {value: claimPrice}})
  }

  const onGenerateRandom = () => {
    const wallet = ethers.Wallet.createRandom()
    setRandomWallet(wallet)
    navigate({pathname: `/address/${wallet.address}`})
  }

  const onSearch = () => {
    setRandomWallet(undefined)
    setSearchQuery(rawSearchQuery)
    setRawSearchQuery("")
    if (rawSearchQuery.indexOf(".") > 0) {
      resolveSearchQuery()
    }
  }

  return <div>
    <div>
      <span>{ensName || (address ? truncateAddress(address) : "Loading...")}</span>
      <AddressTypeTag addressType={addressType}/>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (isAddress(rawSearchQuery) || rawSearchQuery.indexOf(".") > 0) {
          setSearchQuery(rawSearchQuery)
        }
      }}>
        <input type="text" placeholder="Search Address or ENS" value={rawSearchQuery} onChange={(e) => setRawSearchQuery(e.target.value)} />
        <button onClick={() => onSearch()}>Search</button>
      </form>
      
      <button onClick={() => onGenerateRandom()}>Random</button>
    </div>
    {address && <div>
      <PunkDetail address={address}></PunkDetail>
      <ClaimButton 
        address={address} 
        claimPrice={claimPrice ? claimPrice as any as BigNumber : undefined}
        isRandom={randomWallet !== undefined}
        claimable={claimable} 
        claimed={tokenClaimed ? tokenClaimed as any as boolean : undefined} 
        txHash={
          (claimTx?.confirmations === 0 ? claimTx?.hash : undefined) || 
          (claimOtherTx?.confirmations === 0 ? claimOtherTx?.hash : undefined)}
        onClaim={onClaim}
        onClaimOther={onClaimRandom}
        />
    </div>}
    
  </div>
}