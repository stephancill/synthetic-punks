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

  
  const {deployer} = await getNamedAccounts()

  const _attributesContentURI = await attributesContentURI

  const confirmation = await userInput(`
  Confirm IPFS hash of attributes JSON: ${_attributesContentURI}\n
  \n'y' to continue, ENTER to cancel\n`)
  if (confirmation.toLowerCase() !== "y") {
    throw new Error("User denied deployment details");
  }

  await deploy("SyntheticPunksAssets", {
    from: deployer,
    log: true,
    args: [allRanges, _attributesContentURI],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SyntheticPunksAssets"]