import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { spritesheetImageData, attributesContentURI, allRanges } from "../utils/SpritesheetImageData"
import readline from "readline"
import { getENSReverseAddressOrZero } from "../utils/ENSReverseAddresses";

function userInput(query: string): Promise<string> {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }))
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, network, ethers} = hre
  const {deploy} = deployments

  
  const {deployer, withdrawAddress} = await getNamedAccounts()

  if (!withdrawAddress) {
    throw new Error("WITHDRAW_ADDRESS not set");
  }

  const isMainnet = network.name === "mainnet"

  const name = isMainnet ? "Synthetic CryptoPunks" : "Secret Project"
  const symbol = isMainnet ? "sCRYPTOPUNKS" : "sPROJ"
  const ensReverseAddress = getENSReverseAddressOrZero(network.config.chainId!)
  const _attributesContentURI = await attributesContentURI

  const confirmation = await userInput(`
  Confirm name: ${name}\n
  Confirm symbol: ${symbol}\n
  Confirm deployer address: ${deployer}\n
  Confirm withdrawal address: ${withdrawAddress}\n
  Confirm ENS reverse resolution address: ${ensReverseAddress}\n
  \n'y' to continue, ENTER to cancel\n`)
  if (confirmation.toLowerCase() !== "y") {
    throw new Error("User denied deployment details");
  }

  const SyntheticPunksAssets = await deployments.get("SyntheticPunksAssets");

  await deploy("SyntheticPunks", {
    from: deployer,
    log: true,
    args: [name, symbol, SyntheticPunksAssets.address, withdrawAddress, ensReverseAddress],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SyntheticPunks"]
func.dependencies = ["SyntheticPunksAssets"]