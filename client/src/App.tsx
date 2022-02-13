import { ethers, Signer, Wallet } from "ethers"
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import { Network } from '@ethersproject/networks'
import { useEffect, useState } from "react"
import { truncateAddress } from "./utilities"
import "./App.css"
import { ConnectButton } from "./components/ConnectButton/ConnectButton"
import { Punk } from "./components/Punk/Punk"
import { NeonText } from "./components/NeonText/NeonText"
import { Copy } from "./components/Copy/Copy"
import deployments from "./deployments.json"
import search from "./img/search.svg"
import searchSmall from "./img/searchSmall.svg"
import dice from "./img/dice.svg"
import diceSmall from "./img/diceSmall.svg"
import twitter from "./img/twitter.svg"
import opensea from "./img/opensea.svg"
import { IPunkAddress } from "./interfaces/IPunkAddress"
import { AddressType } from "./interfaces/AddressType"

const defaultProvider = new JsonRpcProvider(!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? "http://127.0.0.1:8545/" : "https://mainnet.infura.io/v3/a03218fc876c4ba9a720ba48cc3b8de9")

function App() {
  const [signerOrProvider, setSignerOrProvider] = useState<Signer | BaseProvider | undefined>(undefined)
  const [punkAddress, setPunkAddress] = useState<IPunkAddress | undefined>(undefined)
  const [randomWallet, setRandomWallet] = useState<Wallet | undefined>()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [canClaim, setCanClaim] = useState(false)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)
  const [walletConnected,setWalletConnected] = useState(false)
  const [correctNetwork,setCorrectedNetwork] = useState(false)
  const [tokenID,setTokenID] = useState<string>("")
  const [NFTContractAddress,setNFTContractAddress] = useState<string>("")
  const [claimHash,setClaimHash] = useState<string>("")


  // TODO: Show transaction hash in claim button when it's loading 
  // TODO: Router paths (/punk/<address>)

  // store await claim in var
  // then use var transaction.hash 

  useEffect(() =>{
    (async()=>{
      const accounts = await window.ethereum.request({method: "eth_accounts"})
      if(accounts[0]){
        setWalletConnected(true)
        await connectWallet()
        await checkNetwork()
        if (accounts[0]){
          setPunkAddress({address: accounts[0], type: AddressType.Search})
        }
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
          setCanClaim(punkAddress ? punkAddress.address.toLowerCase()===userAddresss.toLowerCase() : false)
        })()
      }
    }
    // first check if on correct network
    
  }, [signerOrProvider, punkAddress])

  useEffect(() =>{
    window.ethereum.on('accountsChanged',  (accounts: Array<string>) => {
      if (accounts[0]) {
        setPunkAddress({address: accounts[0], type: AddressType.Search})
      }
    });
  },)

  useEffect(() =>{
    window.ethereum.on('networkChanged', (networkId : number) => {
      checkNetwork()
    });
  },)

  useEffect(()=>{
    if (punkAddress?.address) {
      (async()=>{
        const contractAddress = deployments.contracts["SyntheticPunks"].address
        const contractInterface = new ethers.utils.Interface( deployments.contracts["SyntheticPunks"].abi)
        const syntheticPunk = new ethers.Contract(contractAddress, contractInterface, signerOrProvider)
        const fetchedTokenId = await syntheticPunk.getTokenID(punkAddress?.address)
        setTokenID(fetchedTokenId.toString())
        setNFTContractAddress(contractAddress)
        console.log(fetchedTokenId.toString())
      })()
    }
  },[punkAddress])

  const connectWallet = async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const tempsigner = provider.getSigner();
    setSignerOrProvider(tempsigner)
    if (tempsigner !== undefined) {
      let userAddresss = await tempsigner.getAddress();
      setPunkAddress({address: userAddresss, type: AddressType.Signer})
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
    console.log(tx.hash)
    setClaimHash(tx.hash)
    await tx.wait()
    // setClaimHash("")
    // setAlreadyClaimed(true)
    console.log("done")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <NeonText text={"SYNTHETIC PUNKS"} ></NeonText>
      {correctNetwork ? <>
        <div style={{marginTop:"100px", marginBottom: "30px"}}>
        <ConnectButton  setWalletConnected={setWalletConnected} signerOrProvider={signerOrProvider} setSignerOrProvider={setSignerOrProvider} punkAddress={punkAddress} setPunkAddress={setPunkAddress} canClaim={canClaim}/>
      </div>
      <div className={"container"} >
        <form onSubmit={async (e) => {
          e.preventDefault()
          if (!searchQuery) {
            return
          }
          if (searchQuery.indexOf(".") > -1) {
            (async () => {
              const name = searchQuery
              const addr = await signerOrProvider?.resolveName(name)
              addr && setPunkAddress({address: addr, type: AddressType.Search})
            })()
          } else {
            setPunkAddress({address: searchQuery, type: AddressType.Search})
          }
        }}>
          <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search address or ENS" style={{marginTop:"30px", fontWeight: "normal", color: "white"}}/>
          <button className="searchBtn" type="submit">
            <img src={search} style={{height:"26px", width: "32px"}}></img>
          </button>
          <button className="randomBtn" type="button" onClick={() => {
            const wallet = ethers.Wallet.createRandom()
            setRandomWallet(wallet)
            setPunkAddress({address: wallet.address, type: AddressType.Random})
          }}>
            <img src={dice} style={{height:"26px", width: "32px"}}></img>
          </button>
        </form>
      </div>
      {punkAddress?.address && signerOrProvider && walletConnected &&
      <div className="container">
        <div className="backCard">
          <div style={{display:"flex"}}>
            <div className="NFTAddressText">{truncateAddress(punkAddress.address)} </div>

            {{[AddressType.Signer]:<button className="typeBtn" disabled>
              You
            </button>, 
            [AddressType.Random]: <button className="typeBtn" disabled>
            <img src={diceSmall} style={{width:"18px"}}></img>
            </button>
            , [AddressType.Search]: <button className="typeBtn" disabled>
            <img src={searchSmall} style={{width:"14px",marginTop:"1px"}}></img>
            </button>
            }[punkAddress.type]}

            <button className="twitterBtn">
              <img src={twitter}></img>
            </button> 
          </div>
          {punkAddress.address && 
            <Punk punkAddress={punkAddress} signerOrProvider={signerOrProvider}/>
          }
            { !canClaim ? <></> : <>
              { alreadyClaimed ? <a href={"https://opensea.io/assets/"+NFTContractAddress+"/"+tokenID }target="_blank">
                <button className="mintBtn">View on marketplace 
                <img src={opensea} style={{marginBottom:"-5px",marginLeft:"10px"}}></img>
                </button>
              </a> : <>
                { !claimHash ? 
                <button className="mintBtn" onClick={()=>claimNFT()} style={{width:"294px",marginLeft:"8px"}}>Claim 0.02 ♦</button>
                :
                <a href={"etherscan.io/tx/"+{claimHash}} target="_blank">
                <button className="mintBtn" style={{width:"294px",marginLeft:"8px"}}>View Pending Transaction</button>
                </a>
                }
                <button className="helpBtn toolTip" >?
                <span className="toolTipText">You may claim this punk and have it sent to your connected wallet </span>
                </button>
              </>}
            </>}
        </div>
      </div>
      }
      </> : <div className="container">
        <button className="networkBtn" onClick={()=>changeNetwork()}>Wrong network. Click here to switch to Ethereum</button>
      </div>}
      <Copy></Copy>
    </div>
  )
}

export default App
