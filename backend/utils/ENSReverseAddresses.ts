import { ethers } from "ethers"

export const ensReverseAddresses = {
  1: "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
  3: "0x72c33B247e62d0f1927E8d325d0358b8f9971C68",
  4: "0x196eC7109e127A353B709a20da25052617295F6f",
  5: "0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e",
}

export const getENSReverseAddressOrZero = (chainId: number) => {
  return (ensReverseAddresses as any)[chainId] ? (ensReverseAddresses as any)[chainId] : ethers.constants.AddressZero
}