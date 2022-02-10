import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { truncateAddress } from "../../utilities"
import { useEffect } from "react"
import { ethers, Signer } from "ethers"
import  style  from  "./ConnectButton.module.css"
import { BaseProvider } from '@ethersproject/providers'

interface IConnectButtonProps {
  signerOrProvider: Signer | BaseProvider | undefined
  setSignerOrProvider: (arg0: Signer | BaseProvider | undefined) => void
  address: string | undefined
  setAddress: (arg0: string | undefined) => void
  canClaim : boolean

}

export const ConnectButton = ({signerOrProvider, setSignerOrProvider, address, setAddress,canClaim} : IConnectButtonProps) => {
  useEffect(() => {
    if (!signerOrProvider) {
      (async () => {
        const isConnected = await checkHasConnected()
        if (isConnected) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(0)
          setSignerOrProvider(signer)
        }
      })()
    }
  })

  const checkHasConnected = async () => {
    if (!window.ethereum) {
      return false
    }
  
    const accounts = await window.ethereum.request({method: "eth_accounts"})
    return accounts.length > 0
  }

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
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner(0)
      const _address = await signer.getAddress()
      setAddress(_address)
      setSignerOrProvider(signer)
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <div className={style.container}>
    {! address ?  
      <button className={style.connectBtn} onClick={activateProvider}>Connect</button>
    :
    <>
    
    {!canClaim ? <>
      <button className={style.connectBtn} onClick={activateProvider}>Connect</button>
    </>:<>
      <button className={style.connectBtn} onClick={() => setSignerOrProvider(undefined)}>Disconnect {truncateAddress(address)}</button>
    </>}
    </>
    }  
    </div>  
  )
}