import { useEnsLookup } from 'wagmi'
import { useState } from "react"
import { truncateAddress } from "../../utilities"
import { PunkDetail } from "../PunkDetail/PunkDetail"
import { AddressTypeTag } from '../AddressTypeTag/AddressTypeTag'

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
  const {type: addressType, address} = typedAddress
  const [{ data: ensName, loading: ensLoading }, lookupAddress] = useEnsLookup({address})

  return <div>
    <div>
      <span>{ensName || truncateAddress(address)}</span>
      <AddressTypeTag addressType={addressType}/>
    </div>
    <PunkDetail address={address}></PunkDetail>
  </div>
}