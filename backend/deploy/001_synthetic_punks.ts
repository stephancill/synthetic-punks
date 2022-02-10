import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { spritesheetImageData, allRanges } from "../utils/SpritesheetImageData"
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

  const ensReverseAddresses = {
    ropsten: "0x72c33B247e62d0f1927E8d325d0358b8f9971C68",
    rinkeby: "0x196eC7109e127A353B709a20da25052617295F6f",
    goerli: "0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e",
    mainnet: "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
  }

  const isMainnet = network.name === "mainnet"

  const name = isMainnet ? "Synthetic CryptoPunks" : "Secret Project"
  const symbol = isMainnet ? "sCRYPTOPUNKS" : "sPROJ"
  const ensReverseAddress = getENSReverseAddressOrZero(network.config.chainId!)

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

  await deploy("SyntheticPunks", {
    from: deployer,
    log: true,
    args: [name, symbol, spritesheetImageData, allRanges, withdrawAddress, ensReverseAddress],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SyntheticPunks"]