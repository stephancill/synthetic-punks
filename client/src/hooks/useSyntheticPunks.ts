import { ethers } from 'ethers'
import deployments from "../deployments.json"
import { SyntheticPunks } from "../../../backend/types"

export const useSyntheticPunks = (provider: ethers.providers.Provider) => {
  const contractAddress = deployments.contracts["SyntheticPunks"].address
  const contractInterface = new ethers.utils.Interface( deployments.contracts["SyntheticPunks"].abi)
  const syntheticPunk = new ethers.Contract(contractAddress, contractInterface, provider) as SyntheticPunks
  return syntheticPunk
}