import { HardhatUserConfig, task } from "hardhat/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "hardhat-deploy"
import "hardhat-contract-sizer"
import dotenv from "dotenv"
import { HardhatNetworkUserConfig } from "hardhat/types"
import { getAttributeName } from "../lib"
import { BigNumber } from "ethers"
import { spritesheetImageData } from "./utils/SpritesheetImageData"

dotenv.config()

task("attributes", "Prints the attributes for an address", async ({address}, {deployments, ethers}) => {
  const SyntheticPunksContract = await deployments.get("SyntheticPunks")
  const syntheticPunks = (new ethers.Contract(SyntheticPunksContract.address, SyntheticPunksContract.abi, ethers.provider))
  const attributeIds = await syntheticPunks._getAttributes(address)
  const attributeNames = attributeIds.map((id: BigNumber) => getAttributeName((id as BigNumber).toNumber()))
  console.log(attributeNames.join("\n"))
}).addParam("address", "Address to look up attributes for")

task("image-data", "Prints image data to be used in contract", async () => {
  console.log(spritesheetImageData)
  console.log(spritesheetImageData.length)
})

let hardhatNetwork: HardhatNetworkUserConfig = {
  mining: {
    interval: 12000
  }
}

if (process.env.FORK) {
  if (process.env.FORK === "mainnet") {
    console.log("forking mainnet")
    hardhatNetwork = {
      chainId: 1,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      },
    }
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    hardhat: hardhatNetwork,
    rinkeby: {
      chainId: 4,
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: process.env.DEFAULT_DEPLOYER_KEY ? [process.env.DEFAULT_DEPLOYER_KEY!] : [],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY!
        }
      }
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: process.env.DEFAULT_DEPLOYER_KEY ? [process.env.DEFAULT_DEPLOYER_KEY!] : [],
    }
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    withdrawAddress: {
      31337: 0,
      1: process.env.WITHDRAW_ADDRESS_MAINNET!,
      4: 0
    }
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY!
    }
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    // only: [':ERC20$'],
  }
}

export default config
