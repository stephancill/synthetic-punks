import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { spritesheetImageData, allRanges } from "../utils/SpritesheetImageData"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments

  const {deployer} = await getNamedAccounts()

  await deploy("SyntheticPunks", {
    from: deployer,
    log: true,
    args: ["Synthetic CryptoPunks", "sCRYPTOPUNKS", spritesheetImageData, allRanges],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SyntheticPunks"]