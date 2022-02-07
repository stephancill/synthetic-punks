import { ethers } from "hardhat"
import { SyntheticPunks, SyntheticPunks__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"

describe("SyntheticPunks", function () {
  let signers: SignerWithAddress[]
  let syntheticPunks: SyntheticPunks

  beforeEach(async function () {
    signers = await ethers.getSigners()
    const syntheticPunksFactory = new SyntheticPunks__factory(signers[0])
    syntheticPunks = await syntheticPunksFactory.deploy("Synthetic CryptoPunks", "sCRYPTOPUNKS")
    await syntheticPunks.deployed()
  })

  it("should return tokenURI", async function () {
    let uri = await syntheticPunks.tokenURI(0)
    expect(uri).to.not.equal(undefined)
  })
})
