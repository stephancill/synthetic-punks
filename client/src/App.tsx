import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ConnectButton } from './components/ConnectButton/ConnectButton';
import { useAccount } from 'wagmi';
import { NeonText } from './components/NeonText/NeonText';
import { PunkCard } from './components/PunkCard/PunkCard';
import { useEffect } from 'react';

function App() {
  const [{data: account}] = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  

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
        <Routes>
          <Route path="address">
            <Route path=":address" element={<PunkCard/>}>
            </Route>
          </Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
