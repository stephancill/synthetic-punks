import logo from './logo.svg';
import './App.css';
import { ConnectButton } from './components/ConnectButton/ConnectButton';
import { useProvider, useSigner } from 'wagmi';
import { providers } from 'ethers'
import { NeonText } from './components/NeonText/NeonText';
import { PunkDetail } from './components/PunkDetail/PunkDetail';
import { AddressType, PunkCard } from './components/PunkCard/PunkCard';

function App() {
  const provider = useProvider()

  return (
    <div className="App">
      <header className="App-header">
      <NeonText text={"SYNTHETIC PUNKS"} ></NeonText>
        <div>
          <ConnectButton></ConnectButton>
          <PunkCard typedAddress={{address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", type: AddressType.Search}}></PunkCard>
        </div>
      </header>
    </div>
  );
}

export default App;
