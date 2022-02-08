import { Signer } from "ethers"
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import { useEffect, useState } from "react"
import "./App.css"
import { ConnectButton } from "./components/ConnectButton/ConnectButton"
import { Punk } from "./components/Punk/Punk"

const defaultProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/a03218fc876c4ba9a720ba48cc3b8de9")

function App() {
  const [signerOrProvider, setSignerOrProvider] = useState<Signer | BaseProvider | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  useEffect(() => {
    if (!signerOrProvider) {
      setSignerOrProvider(defaultProvider)
    }
  }, [])
  
  return (
    <div>
      <div>
        <ConnectButton signerOrProvider={signerOrProvider} setSignerOrProvider={setSignerOrProvider} address={address} setAddress={setAddress}/>
      </div>
      <div>
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
        <Punk address={address} signerOrProvider={signerOrProvider}/>
      </div>}
    </div>
  )
}

export default App
