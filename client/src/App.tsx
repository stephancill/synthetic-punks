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

const deploymentChain = parseInt(deployments.chainId)

function App() {
  const [{data: account}] = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const [{data: network}, switchNetwork] = useNetwork()

  // TODO: Styling
  // TODO: Copy on / route
  // TODO: Include contract addresses in copy
  // TODO: Site metadata for twitter (https://stackoverflow.com/a/26160761/11363384)
  // TODO: Clicking the neon header should take the user to /
  // TODO: Footer
  // TODO: Button for user to see their punk

  useEffect(() => {
    if (account && location.pathname === "/") {
      navigate(`/address/${account.address}`)
    }
  }, [account, location.pathname, navigate])

  return (
    <div className="App">
      <NeonText></NeonText>
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
    </div>
  );
}

export default App;
