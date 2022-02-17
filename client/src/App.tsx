import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ConnectButton } from './components/ConnectButton/ConnectButton';
import { useAccount, useNetwork } from 'wagmi';
import { NeonText } from './components/NeonText/NeonText';
import { PunkCard } from './components/PunkCard/PunkCard';
import { useEffect } from 'react';
import { Search } from './components/Search/Search';
import deployments from "./deployments.json"
import { Copy } from "./components/Copy/Copy"
import opensea from "./img/opensea.svg"
import github from "./img/github.svg"
import etherscan from "./img/etherscan.svg"

const deploymentChain = parseInt(deployments.chainId)

function App() {
  const [{data: account}] = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const [{data: network}, switchNetwork] = useNetwork()

  // TODO: Style switch network button
  // TODO: Site metadata for twitter (https://stackoverflow.com/a/26160761/11363384)
  // TODO: Button for user to see their punk
  // TODO: Fix claim button states
  // TODO: Show if someone owns a punk with a different address
  // TODO: Fix padding when no button available

  useEffect(() => {
    if (account && location.pathname === "/") {
      navigate(`/address/${account.address}`)
    }
  }, [account, location.pathname, navigate])

  return (
    <div className="App">
      <NeonText></NeonText>
      <div className="linksContainer" style={{display: "flex"}}>
        <a href="https://opensea.io/collection/synthetic-cryptopunks" target="_blank" rel="noopener noreferrer"><img src={opensea}/></a>
        <a href="https://github.com/stephancill/synthetic-punks" target="_blank" rel="noopener noreferrer"><img src={github}/></a>
        <a href="https://etherscan.io/address/0xaf9ce4b327a3b690abea6f78eccbfefffbea9fdf" target="_blank" rel="noopener noreferrer"><img src={etherscan}/></a>
      </div>
      <ConnectButton/>
      {network && switchNetwork && network.chain?.id !== deploymentChain 
      ?
        <button onClick={() => switchNetwork(deploymentChain)}>Switch to {deployments.name}</button>
      :
        <Routes>
          <Route path="/" element={
            <div style={{display: "flex", width: "90%", maxWidth: "400px"}}>
              <Search onSearch={(address) => navigate(`/address/${address}`)}/>
            </div>
          }/>
          <Route path="address">
            <Route path=":address" element={<PunkCard/>}/>
          </Route>
          <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
        </Routes>
      }
      <Copy/>
      <footer style={{marginBottom: "20px"}}>
        Created by <a href="https://twitter.com/stephancill" target="_blank" rel="noopener noreferrer">@stephancill</a> and <a href="https://twitter.com/npm_luko" target="_blank" rel="noopener noreferrer">@npm_luko</a>
      </footer>
    </div>
  );
}

export default App;
