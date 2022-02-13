import { ethers, network } from "hardhat"
import { SyntheticPunksAssets, SyntheticPunksAssets__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { spritesheetImageData, allRanges, attributesContentURI } from "../utils/SpritesheetImageData"
import isSvg from "is-svg"
import { getENSReverseAddressOrZero } from "../utils/ENSReverseAddresses"

describe("SyntheticPunks", function () {
  let signers: SignerWithAddress[]
  let syntheticPunksAssets: SyntheticPunksAssets

  beforeEach(async function () {
    signers = await ethers.getSigners()
    const syntheticPunksAssetsFactory = new SyntheticPunksAssets__factory(signers[0])
    const _attributesContentURI = await attributesContentURI
    syntheticPunksAssets = await syntheticPunksAssetsFactory.deploy(allRanges, _attributesContentURI) 
    await syntheticPunksAssets.deployed()
  })

  it("should contain the attributes content hash", async function () {
    const CID = await syntheticPunksAssets.attributesContentURI()
    expect(CID.length).to.be.equal(46+"ipfs://".length)
  })

  it("should store spritesheet image data", async function () {
    let imageData = await syntheticPunksAssets.spritesheetImageData()
    expect(imageData.split(",")[0]).to.equal("data:image/png;charset:utf-8;base64")
    expect(imageData.split(",")[1].length).to.be.greaterThan(0)
  })

  it("should store spritesheet attribute ranges", async function () {
    let spritesheetRanges = await syntheticPunksAssets.spritesheetRanges()
    expect(spritesheetRanges.length).to.equal(9)
    expect(spritesheetRanges[0].length).to.equal(4)
  })
})