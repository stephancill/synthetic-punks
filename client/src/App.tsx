import { ethers, Signer } from "ethers"
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import { useEffect, useState } from "react"
import "./App.css"
import { ConnectButton } from "./components/ConnectButton/ConnectButton"
import { Punk } from "./components/Punk/Punk"
import { NeonText } from "./components/NeonText/NeonText"
import deployments from "./deployments.json"

const defaultProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/a03218fc876c4ba9a720ba48cc3b8de9")

function App() {
  const [signerOrProvider, setSignerOrProvider] = useState<Signer | BaseProvider | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [canClaim, setCanClaim] = useState(false)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)


  useEffect(() => {
    if (!signerOrProvider) {
      setSignerOrProvider(defaultProvider)
    }
    console.log(defaultProvider)
  }, [signerOrProvider])

  useEffect(() => {
    console.log(signerOrProvider instanceof Signer,"s")
    if (signerOrProvider instanceof Signer) {
      (async () => {
        const signerAddress = await (signerOrProvider as Signer).getAddress()
        const contractAddress = deployments.contracts["SyntheticPunks"].address
        const contractInterface = new ethers.utils.Interface( deployments.contracts["SyntheticPunks"].abi)
        const syntheticPunk = new ethers.Contract(contractAddress, contractInterface, signerOrProvider)
        const claimed = await syntheticPunk.claimed(signerAddress)
        console.log(claimed,"already claimed")
        setAlreadyClaimed(claimed)
          // check claimed
          // if false they can mint
        setCanClaim(address?.toLowerCase()===signerAddress.toLowerCase())
      })()
    }
  }, [signerOrProvider, address])

  const claimNFT = async () => {
    const contractAddress = deployments.contracts["SyntheticPunks"].address
    const contractInterface = new ethers.utils.Interface( deployments.contracts["SyntheticPunks"].abi)
    const syntheticPunk = new ethers.Contract(contractAddress, contractInterface, signerOrProvider)
    const claimPrice = await syntheticPunk.claimPrice()
    try {
    const tx = await syntheticPunk.connect(signerOrProvider as Signer).claim({value: claimPrice})
    console.log(tx) 
    setAlreadyClaimed(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <NeonText text={"SYNTHETIC PUNKS"} ></NeonText>
      <div style={{marginTop:"100px"}}>
        <ConnectButton  signerOrProvider={signerOrProvider} setSignerOrProvider={setSignerOrProvider} address={address} setAddress={setAddress}/>
      </div>
      <div className={"container"} style={{marginTop:"40px"}}>
        <form onSubmit={async (e) => {
          e.preventDefault()
          if (searchQuery.indexOf(".") > -1) {
            (async () => {
              console.log("resolving", searchQuery)
              const name = searchQuery
              console.log(signerOrProvider)
              const addr = await signerOrProvider?.resolveName(name)
              console.log(addr)
              addr && setAddress(addr)
            })()
          } else {
            console.log("address", searchQuery)
            setAddress(searchQuery)
          }
          
        }}>
          <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search address or ENS" />
        </form>
      </div>
      {address && signerOrProvider &&
      <div>
        <div className="container">
         <Punk address={address} signerOrProvider={signerOrProvider}/>
        </div>
      </div>}
      <div className="container" style={{marginTop:"25px",marginBottom:"80px"}}>
        { !canClaim ? <></> : <>
          { alreadyClaimed ? <>
            <button className="mintBtn" disabled>
              Claimed
            </button>
          </> : <>
            <button className="mintBtn" onClick={()=>claimNFT()}>
              Claim 0.02ETH
            </button>
          </>}
        
        </>}
      </div>
      <div className="textContainer">
        <div>
          <h3 className="textGlow">
          <b>Synthetic CryptoPunks</b> is inspired by the historical collection of 10,000 CryptoPunks by Larva Labs. It generates unique CryptoPunks for any  is a virtual form of Loot that every wallet has automatically and does not need to be minted.
          </h3>
          <h3 className="textGlow">
          Unlike original Loot which is generated based on a numeric identifier, Synthetic Loot is generated based on your Ethereum wallet address. Developers who are building on top of Loot can easily incorporate Synthetic Loot into their projects, allowing the entire Ethereum ecosystem to access their projects for free.
          </h3>
        </div>
      </div>
      <div className="textContainer" style={{marginTop:"80px", marginLeft:"-0px"}}>
      
          <h4 className="footText">
            Made by <a href="https://twitter.com/stephancill">@stephancill</a> and <a href="https://twitter.com/npm_luko">@npm_luko</a>
          </h4>
        
      </div>
    </div>
  )
}

export default App
