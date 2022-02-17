import { useEffect, useState } from 'react';
import { useAccount, useConnect, useSigner } from 'wagmi'
import { truncateAddress } from "../../utilities";
import { GenericModal } from '../GenericModal/GenericModal';
import style from "./ConnectButton.module.css"

export const ConnectButton = () => {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const [{ data: signer, error }] = useSigner()
  const [isConnecting, setIsConnecting] = useState(false)

  const ensName = accountData?.ens?.name

  useEffect(() => {
    signer && setIsConnecting(false)
  }, [signer])

  return (
    <>
      {accountData 
      ? 
        <button className={style.connectBtn}onClick={() => disconnect()}>Disconnect {ensName || truncateAddress(accountData.address)}</button> 
      : 
        <button className={style.connectBtn} onClick={() => setIsConnecting(!isConnecting)}>Connect</button> 
      }
      <GenericModal setShouldShow={setIsConnecting} shouldShow={isConnecting} content={
        <div className={style.connectModalCard}>
          <h1 style={{textAlign: "left", marginBottom: "20px"}}>Connect</h1>
          {connectData.connectors.map((connector) => (
            <button className={style.walletOption}
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect(connector)}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
            </button>
          ))}
          {/* <button className={style.backBtn} onClick={() => setIsConnecting(!isConnecting)} >Back </button> */}
          {error && <div>{error?.message ?? 'Failed to connect'}</div>}
        </div>
      }></GenericModal>
    </>
  )
}