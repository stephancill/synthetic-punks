import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ConnectButton } from './components/ConnectButton/ConnectButton';
import { useAccount, useNetwork } from 'wagmi';
import { NeonText } from './components/NeonText/NeonText';
import { PunkCard } from './components/PunkCard/PunkCard';
import { useEffect } from 'react';
import { Search } from './components/Search/Search';
import deployments from "./deployments.json"

const deploymentChain = parseInt(deployments.chainId)

function App() {
  const [{data: account}] = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const [{data: network}, switchNetwork] = useNetwork()

  // TODO: Styling
  // TODO: Copy
  // TODO: Include contract addresses in copy
  // TODO: Make search a component so that it can be used on landing page
  // TODO: Twitter share button
  // TODO: Site metadata for twitter
  // TODO: IPFS /# path (see EFD)

  useEffect(() => {
    if (account && location.pathname === "/") {
      navigate(`/address/${account.address}`)
    }
  }, [account, location.pathname, navigate])

  return (
    <div className="App">
      <header className="App-header">
        <NeonText text={"SYNTHETIC PUNKS"} ></NeonText>
        <ConnectButton/>
        {network && switchNetwork && network.chain?.id !== deploymentChain 
        ?
          <button onClick={() => switchNetwork(deploymentChain)}>Switch to {deployments.name}</button>
        :
          <Routes>
            <Route path="/" element={<Search onSearch={(address) => navigate(`/address/${address}`)}/>}/>
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
      </header>
    </div>
  );
}

export default App;
