import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { spritesheetImageData, allRanges } from "../utils/SpritesheetImageData"
import readline from "readline"

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

  const confirmation = await userInput(`Confirm withdrawal address: ${withdrawAddress}\n'y' to continue, ENTER to cancel\n`)
  if (confirmation.toLowerCase() !== "y") {
    throw new Error("User denied withdrawal address");
  }

  await deploy("SyntheticPunks", {
    from: deployer,
    log: true,
    args: ["Synthetic CryptoPunks", "sCRYPTOPUNKS", spritesheetImageData, allRanges, withdrawAddress],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SyntheticPunks"]