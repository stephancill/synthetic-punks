import { ethers } from "hardhat"
import { SyntheticPunks, SyntheticPunks__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { spritesheetImageData, allRanges } from "../utils/SpritesheetImageData"

describe("SyntheticPunks", function () {
  let signers: SignerWithAddress[]
  let withdrawAddress: string
  let syntheticPunks: SyntheticPunks

  beforeEach(async function () {
    signers = await ethers.getSigners()
    withdrawAddress = signers[1].address
    const syntheticPunksFactory = new SyntheticPunks__factory(signers[0])
    syntheticPunks = await syntheticPunksFactory.deploy("Synthetic CryptoPunks", "sCRYPTOPUNKS", spritesheetImageData, allRanges, withdrawAddress)
    await syntheticPunks.deployed()
  })

  it("should set the withdrawal address", async function () {
    let storedAddress = await syntheticPunks.withdrawAddress()
    expect(storedAddress).to.equal(withdrawAddress)
  })

  it("should let a user claim", async function () {
    
  })

  it("should store spritesheet image data", async function () {
    let imageData = await syntheticPunks.spritesheetImageData()
    expect(imageData.split(",")[0]).to.equal("data:image/png;charset:utf-8;base64")
    expect(imageData.split(",")[1].length).to.be.greaterThan(0)
  })

  it("should return tokenURI", async function () {
    let uri = await syntheticPunks.tokenURI(1)
    expect(uri).to.not.equal(undefined)
  })

  // it("should generate random number", async function () {
  //   const random = await Promise.all([...new Array(100)].map((_, i) => {
  //     return Promise.all([...new Array(31)].map((_, j) => syntheticPunks.randomUint(i, j)))
  //   }))
  //   console.log(random)
  // }) 
})
