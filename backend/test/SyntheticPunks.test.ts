import { ethers } from "hardhat"
import { SyntheticPunks, SyntheticPunks__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { spritesheetImageData, allRanges } from "../utils/SpritesheetImageData"

describe("SyntheticPunks", function () {
  let signers: SignerWithAddress[]
  let withdrawSigner: SignerWithAddress
  let syntheticPunks: SyntheticPunks

  beforeEach(async function () {
    signers = await ethers.getSigners()
    withdrawSigner = signers[1]
    const syntheticPunksFactory = new SyntheticPunks__factory(signers[0])
    syntheticPunks = await syntheticPunksFactory.deploy("Synthetic CryptoPunks", "sCRYPTOPUNKS", spritesheetImageData, allRanges, withdrawSigner.address)
    await syntheticPunks.deployed()
  })

  it("should set the withdrawal address", async function () {
    let storedAddress = await syntheticPunks.withdrawAddress()
    expect(storedAddress).to.equal(withdrawSigner.address)
  })

  it("should set the price to 0.02 eth", async function () {
    const claimPrice = await syntheticPunks.claimPrice()
    expect(claimPrice).to.equal(ethers.utils.parseUnits("0.02", "ether"))
  })

  it("should let a user claim", async function () {
    const user = signers[2]
    const claimPrice = await syntheticPunks.claimPrice()
    const tx = await syntheticPunks.connect(user).claim({value: claimPrice})
    const txResult = await tx.wait()
    expect(txResult.events?.length).to.equal(1)

    const transferEvent = txResult.events![0]
    expect(transferEvent.event).to.equal("Transfer")
    expect(transferEvent.args![0]).to.equal(ethers.constants.AddressZero)
    expect(transferEvent.args![1]).to.equal(user.address)
  })

  it("should reject claims with insufficient value", async function() {
    const user = signers[2]
    const claimPrice = await syntheticPunks.claimPrice()
    const tx = syntheticPunks.connect(user).claim({value: claimPrice.div("2")})
    expect(tx).to.be.revertedWith("Insufficient payment")
  })

  it("should give refunds for payments that exceed claimPrice", async function() {
    let user = signers[3]
    const claimPrice = await syntheticPunks.claimPrice()
    const balanceBefore = await user.getBalance()
    await syntheticPunks.connect(user).claim({value: claimPrice.mul("2")})
    const balanceAfter = await user.getBalance()

    expect(balanceAfter).to.be.gte(balanceBefore.sub(claimPrice.mul("2")))
  })

  it("should withdraw the correct amount to the correct address", async function() {
    let user = signers[4]
    const balanceBefore = await withdrawSigner.getBalance()
    const claimPrice = await syntheticPunks.claimPrice()
    await syntheticPunks.connect(user).claim({value: claimPrice.mul("2")})
    await syntheticPunks.connect(user).withdraw()
    const balanceAfter = await withdrawSigner.getBalance() 

    expect(balanceAfter).to.equal(balanceBefore.add(claimPrice))
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
