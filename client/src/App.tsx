import { ethers, Signer } from "ethers"
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import { Network } from '@ethersproject/networks'
import { useEffect, useState } from "react"
import { truncateAddress } from "./utilities"
import "./App.css"
import { ConnectButton } from "./components/ConnectButton/ConnectButton"
import { Punk } from "./components/Punk/Punk"
import { NeonText } from "./components/NeonText/NeonText"
import deployments from "./deployments.json"
import search from "./img/search.svg"
import dice from "./img/dice.svg"
import twitter from "./img/twitter.svg"



const defaultProvider = new JsonRpcProvider(!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? "http://127.0.0.1:8545/" : "https://mainnet.infura.io/v3/a03218fc876c4ba9a720ba48cc3b8de9")

function App() {
  const [signerOrProvider, setSignerOrProvider] = useState<Signer | BaseProvider | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [canClaim, setCanClaim] = useState(false)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)
  const [walletConnected,setWalletConnected] = useState(false)
  const [correctNetwork,setCorrectedNetwork] = useState(false)
  

  // TODO: Show transaction hash in claim button when it's loading 
  // TODO: Show when punk is claimed: Link to opensea
  // TODO: Router paths (/punk/<address>)
  // TODO: Reconsider glowing in SVG, maybe a dark green outline would look better

  useEffect(() =>{
    (async()=>{
      const accounts = await window.ethereum.request({method: "eth_accounts"})
      if(accounts[0]){
        setWalletConnected(true)
        await connectWallet()
        await checkNetwork()
        setAddress(accounts[0])
      }
    })()
  },[])

  useEffect(() => {
    if (correctNetwork && walletConnected) {
      if (signerOrProvider instanceof Signer) {
        (async () => {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          await provider.send("eth_requestAccounts", []);
          const tempsigner = provider.getSigner();
          const contractAddress = deployments.contracts["SyntheticPunks"].address
          const contractInterface = new ethers.utils.Interface( deployments.contracts["SyntheticPunks"].abi)
          const syntheticPunk = new ethers.Contract(contractAddress, contractInterface, signerOrProvider)
          const userAddresss = await tempsigner.getAddress();
          const claimed = await syntheticPunk.claimed(userAddresss)
          setAlreadyClaimed(claimed)
          setCanClaim(address?.toLowerCase()===userAddresss.toLowerCase())
        })()
      }
    }
    // first check if on correct network
    
  }, [signerOrProvider, address])

  useEffect(() =>{
    window.ethereum.on('accountsChanged',  (accounts: Array<string>) => {
      setAddress(accounts[0])
    });
  },)

  useEffect(() =>{
    window.ethereum.on('networkChanged', (networkId : number) => {
      checkNetwork()
    });
  },)

  const connectWallet = async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const tempsigner = provider.getSigner();
    setSignerOrProvider(tempsigner)
    if (tempsigner !== undefined) {
      let userAddresss = await tempsigner.getAddress();
      setAddress(userAddresss)
    } else {
      setSignerOrProvider(defaultProvider)
    }
  }

  const checkNetwork = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const chainId = await provider.getNetwork()
    const id = chainId.chainId
    if (id && id === parseInt(deployments.chainId)) {
      // correct chain
      setCorrectedNetwork(true)
    } else {
      // incorrect chain
      setCorrectedNetwork(false)
    }
  }

  const changeNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number(1337).toString(16)}` }],
      });
    } catch (error) {
      console.log(error)
    }
  }

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
      {correctNetwork ? <>
        <div style={{marginTop:"100px", marginBottom: "30px"}}>
        <ConnectButton  setWalletConnected={setWalletConnected} signerOrProvider={signerOrProvider} setSignerOrProvider={setSignerOrProvider} address={address} setAddress={setAddress} canClaim={canClaim}/>
      </div>
      <div className={"container"} >
        <form onSubmit={async (e) => {
          e.preventDefault()
          if (searchQuery.indexOf(".") > -1) {
            (async () => {
              const name = searchQuery
              const addr = await signerOrProvider?.resolveName(name)
              addr && setAddress(addr)
            })()
          } else {
            setAddress(searchQuery)
          }
        }}>
          <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search address or ENS" style={{marginTop:"30px"}}/>
          <button className="searchBtn">
            <img src={search} style={{height:"30px"}}></img>
          </button>
          <button className="randomBtn">
            <img src={dice} style={{height:"25px"}}></img>
          </button>
        </form>
        <button onClick={() => setAddress(ethers.Wallet.createRandom().address)}>Random</button>
      </div>
      {address && signerOrProvider && walletConnected &&
      <div className="container">
        <div className="backCard">
          <div className="NFTAddressText">{truncateAddress(address)}</div> 
          <button className="twitterBtn">
            <img src={twitter}></img>
          </button> 
          {address && 
            <Punk address={address}  signerOrProvider={signerOrProvider}/>
          }
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
      </div>
      }
      </> : <div className="container">
        <button className="networkBtn" onClick={()=>changeNetwork()}>Wrong network. Click here to switch to Ethereum</button>
      </div>}
      <div className="textContainer">
        <div>
          <h3 className="textGlow">
          <b>Synthetic CryptoPunks</b> is inspired by the historical collection of 10,000 CryptoPunks by Larva Labs. It generates a unique, fully on-chain CryptoPunk for each Ethereum address.
          </h3>
          <h3 className="textGlow">
          They are free to view for any address, but can be claimed as an ERC-721 NFT for a price of 0.02 ether.
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
