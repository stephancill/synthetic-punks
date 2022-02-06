import "./App.css"
import { useEthers } from "@usedapp/core"
import { ConnectButton } from "./components/ConnectButton/ConnectButton"

function App() {
  return (
    <div>
      <div>
        <ConnectButton/>
      </div>
    </div>
  )
}

export default App
