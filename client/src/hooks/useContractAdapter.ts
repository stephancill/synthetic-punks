import { BaseContract } from "ethers"

export const useContractAdapter = (contract: BaseContract) => {
  return {
    addressOrName: contract.address,
    contractInterface: contract.interface,
    signerOrProvider: contract.signer || contract.provider,
  }
}