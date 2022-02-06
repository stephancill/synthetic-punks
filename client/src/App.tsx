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
        <Punk address={account}/>
      </div>}
      
    </div>
  )
}

export default App
