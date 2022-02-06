import { useEthers } from "@usedapp/core"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"

export const ConnectButton = () => {
  const {activate, deactivate, account} = useEthers()
  const activateProvider = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: "Metamask",
          description: "Connect with the provider in your Browser",
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          bridge: "https://bridge.walletconnect.org",
          infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
        },
      },
    }

    const web3Modal = new Web3Modal({
      providerOptions,
    })
    
    try {
      const provider = await web3Modal.connect()
      await activate(provider)
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    !account ? 
    <button onClick={activateProvider}>Connect</button>
    :
    <button onClick={() => deactivate()}>{account}</button>
  )
}