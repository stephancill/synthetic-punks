import "./App.css"
import { useEthers } from "@usedapp/core"
import { ConnectButton } from "./components/ConnectButton/ConnectButton"
import { Punk } from "./components/Punk/Punk"

function App() {
  const {account} = useEthers()
  return (
    <div>
      <div>
        <ConnectButton/>
      </div>
      {account && 
      <div>
        {[...new Array(100)].map((_, i) => {
          return <Punk key={i} address={account}/>
        })}
        
      </div>}
      
    </div>
  )
}

export default App
