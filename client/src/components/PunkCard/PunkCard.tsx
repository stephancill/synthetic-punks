import { useAccount, useContract, useContractRead, useContractWrite, useEnsLookup, useProvider, useSigner, useSignMessage } from "wagmi"
import { useEffect, useState } from "react"
import { truncateAddress } from "../../utilities"
import { PunkDetail } from "../PunkDetail/PunkDetail"
import { AddressTypeTag } from '../AddressTypeTag/AddressTypeTag'
import { useSyntheticPunks } from '../../hooks/useSyntheticPunks'
import { useContractAdapter } from '../../hooks/useContractAdapter'
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { BigNumber, ethers, Wallet } from "ethers"
import { SyntheticPunks } from "../../../../backend/types"

export enum AddressType {
  Search,
  Signer,
  Random
}

interface ITypedAddress {
  address: string
  type: AddressType
}

export const PunkCard = ({typedAddress}: {typedAddress: ITypedAddress}) => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const [randomWallet, setRandomWallet] = useState<Wallet | undefined>()
  const [searchedAddressOrENS, setSearchQuery] = useState<string | undefined>()

  const address = randomWallet?.address || (searchedAddressOrENS ? ethers.utils.getAddress(searchedAddressOrENS) : undefined) || account?.address
  const addressType = (randomWallet?.address && AddressType.Random) || ((searchedAddressOrENS ? ethers.utils.getAddress(searchedAddressOrENS) : undefined) && AddressType.Search) || AddressType.Signer

  const [{ data: ensName, loading: ensLoading }, lookupAddress] = useEnsLookup({address})

  const syntheticPunks = useSyntheticPunks(signer || provider)
  const syntheticPunksConfig = useContractAdapter(syntheticPunks)

  const [{ data: tokenClaimed }, readTokenClaimed] = useContractRead(
    syntheticPunksConfig,
    'claimed',
    {args: [address]}
  ) 

  const [{ data: claimPrice }] = useContractRead(
    syntheticPunksConfig,
    'claimPrice',
  ) 

  const [{ data: claimMessage }] = useContractRead(
    syntheticPunksConfig,
    'claimMessage',
  ) 

  const [{ data: claimMessageHash }] = useContractRead(
    syntheticPunksConfig,
    'getMessageHash',
    {args: [claimMessage]}
  ) 

  const [{ data: claimTx }, claim] = useContractWrite(
    syntheticPunksConfig,
    'claim',
    {overrides: {value: claimPrice}}
  )

  const [{ data: signature }, signClaimMessage] = useSignMessage({
    message: claimMessageHash ? ethers.utils.arrayify(claimMessageHash) : undefined,
  }) 

  const [{ data: claimOtherTx, error: claimOtherError }, claimOther] = useContractWrite(
    syntheticPunksConfig,
    'claimOther',
    {
      // args: [randomWallet?.address, signature],
      overrides: {value: claimPrice}
    }
  )

  const claimable = address === account?.address || address === randomWallet?.address

  useEffect(() => {
    readTokenClaimed()
  }, [address])

  useEffect(() => {
    console.log(claimOtherError)
  }, [claimOtherError])

  const onClaim = () => {
    (async () => {
      await claim()
    })() 
  }

  const onClaimRandom = () => {
    if (!claimMessage || !randomWallet) {
      return
    }
    (async () => {
      const {data: signature} = await signClaimMessage()
      console.log([randomWallet.address, signature])
      await claimOther({args: [randomWallet.address, signature], overrides: {value: claimPrice}}) // TODO: Fix this
    })()
  }

  const onGenerateRandom = () => {
    const wallet = ethers.Wallet.createRandom()
    setRandomWallet(wallet)
  }

  const onSearch = () => {
    setRandomWallet(undefined)
  }

  return <div>
    <div>
      <span>{ensName || (address ? truncateAddress(address) : "Loading...")}</span>
      <AddressTypeTag addressType={addressType}/>
      <button onClick={() => onGenerateRandom()}>Random</button>
      <button onClick={() => onSearch()}>Search</button>
    </div>
    {address && <>
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
    </>}
    
  </div>
}