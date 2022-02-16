import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, defaultChains, developmentChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import deployments from "./deployments.json"
import { JsonRpcProvider } from '@ethersproject/providers';
import { HashRouter } from 'react-router-dom';

export declare type Chain = {
  id: number;
  name: AddEthereumChainParameter['chainName'];
  nativeCurrency?: AddEthereumChainParameter['nativeCurrency'];
  rpcUrls: AddEthereumChainParameter['rpcUrls'];
  blockExplorers?: {
      name: string;
      url: string;
  }[];
  testnet?: boolean;
};
// API key for Ethereum node
const infuraId = process.env.REACT_APP_INFURA_PROJECT_ID

const deployedChainId = parseInt(deployments.chainId)
const defaultProvider = new JsonRpcProvider(deployedChainId === 31337 ? "http://127.0.0.1:8545/" : `https://mainnet.infura.io/v3/${infuraId}`)

// Chains for connectors to support
const chains = [...developmentChains, ...defaultChains].filter(chain => chain.id === parseInt(deployments.chainId))

// Set up connectors
const connectors = ({ chainId }: {chainId?: number}) => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    })
  ]
}


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider autoConnect provider={defaultProvider} connectors={connectors}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
