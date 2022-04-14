import { ethers, network } from "hardhat"
import { SyntheticPunks, SyntheticPunks__factory, SyntheticPunksAssets, SyntheticPunksAssets__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { spritesheetImageData, allRanges, attributesContentURI } from "../utils/SpritesheetImageData"
import isSvg from "is-svg"
import { getENSReverseAddressOrZero } from "../utils/ENSReverseAddresses"

describe("SyntheticPunks", function () {
  let signers: SignerWithAddress[]
  let withdrawSigner: SignerWithAddress
  let syntheticPunks: SyntheticPunks
  let syntheticPunksAssets: SyntheticPunksAssets

  beforeEach(async function () {
    signers = await ethers.getSigners()
    withdrawSigner = signers[1]
    const ensReverseAddress = getENSReverseAddressOrZero(network.config.chainId!)
    const syntheticPunksFactory = new SyntheticPunks__factory(signers[0])
    const syntheticPunksAssetsFactory = new SyntheticPunksAssets__factory(signers[0])
    const _attributesContentURI = await attributesContentURI
    syntheticPunksAssets = await syntheticPunksAssetsFactory.deploy(allRanges, _attributesContentURI) 
    await syntheticPunksAssets.deployed()
    syntheticPunks = await syntheticPunksFactory.deploy("Synthetic CryptoPunks", "sCRYPTOPUNKS", syntheticPunksAssets.address, withdrawSigner.address, ensReverseAddress)
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

    const claimed = await syntheticPunks.claimed(user.address)
    expect(claimed).to.be.true
  })

  it("should let a user claim to a different account", async function() {
    const user = signers[2]

    const otherWallet = ethers.Wallet.createRandom()
    const message = await syntheticPunks.claimMessage()
    const messageHash = await syntheticPunks.getMessageHash(message)
    console.log(messageHash)
    const signature = await otherWallet.signMessage(ethers.utils.arrayify(messageHash))

    const claimPrice = await syntheticPunks.claimPrice()
    const tx = await syntheticPunks.connect(user).claimOther(otherWallet.address, signature ,{value: claimPrice})
    const txResult = await tx.wait()
    expect(txResult.events?.length).to.equal(1)

    const transferEvent = txResult.events![0]
    expect(transferEvent.event).to.equal("Transfer")
    expect(transferEvent.args![0]).to.equal(ethers.constants.AddressZero)
    expect(transferEvent.args![1]).to.equal(user.address, "Transferred to incorrect address")

    const userBalance = await syntheticPunks.balanceOf(user.address)
    expect(userBalance).to.equal(1)

    const otherWalletBalance = await syntheticPunks.balanceOf(otherWallet.address)
    expect(otherWalletBalance).to.equal(0)

    const otherUserClaimed = await syntheticPunks.claimed(otherWallet.address)
    expect(otherUserClaimed).to.be.true

    const claimed = await syntheticPunks.claimed(user.address)
    expect(claimed).to.be.false
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

  it("should return valid tokenURI", async function () {
    const uri = await syntheticPunks._tokenURI(signers[0].address)
    expect(uri).to.not.equal(undefined)
    // console.log(atob(uri.split(",")[1]))
    const metadata = JSON.parse(atob(uri.split(",")[1]))
    // console.log(metadata.image);
    ;["name", "description", "image"].forEach(key => expect(Object.keys(metadata)).to.contain(key))

    const addressLength = signers[0].address.length
    const userAddress = signers[0].address.toLowerCase()
    const truncatedAddress = `${userAddress.slice(0,6)}...${userAddress.slice(addressLength-4,addressLength)}`
    expect(metadata.name).to.contain(truncatedAddress)

    const svg = atob(metadata.image.split(",")[1])
    expect(isSvg(svg)).to.be.true
  })

  it("should return attributes", async function() {
    const attributes = await syntheticPunks.getAttributes(0)
    expect(attributes.length).to.be.gt(0)
  })

  it("should transfer the token", async function() {
    const user = signers[2]
    const otherUser = signers[3]
    const claimPrice = await syntheticPunks.claimPrice()
    let tx = await syntheticPunks.connect(user).claim({value: claimPrice})
    await tx.wait()

    const tokenId = await syntheticPunks.getTokenID(user.address)
    const initialOwnerAddress = await syntheticPunks.ownerOf(tokenId)

    expect(initialOwnerAddress).to.equal(user.address)

    tx = await syntheticPunks.connect(user).transferFrom(user.address, otherUser.address, tokenId)
    await tx.wait()
    const newOwnerAddress = await syntheticPunks.ownerOf(tokenId)

    expect(newOwnerAddress).to.equal(otherUser.address)
  })
})
