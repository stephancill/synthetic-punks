import { ReactElement, useState } from "react"
import deployments from "../../deployments.json"

interface ISection {
  heading: string
  body: ReactElement
}

export const Copy = () => {
  const sections: ISection[] = [
    {
      heading: "What are Synthetic Punks?",
      body: <p><b>Synthetic CryptoPunks</b> is inspired by the historical collection of 
      10,000 <a href="https://www.larvalabs.com/cryptopunks" target="_blank" rel="noopener noreferrer">CryptoPunks by Larva Labs</a> and <a href="https://www.lootproject.com/" target="_blank" rel="noopener noreferrer">Synthetic Loot</a> by <a href="https://twitter.com/dhof" target="_blank" rel="noopener noreferrer">dhof</a>. 
      It generates a unique, fully on-chain CryptoPunk for each Ethereum address.
      <br/><br/>They are free to view for any address, but can be claimed as an ERC-721 NFT for a price of 0.02 ether.</p>
    },
    {
      heading: "Features",
      body: <p>Each Synthetic Punk
        <ul>
          <li>Is generated from assets stored <a href={`https://etherscan.io/address/${deployments.contracts.SyntheticPunksAssets.address}`}>fully on-chain</a></li>
          <li>Is uniquely associated with an ethereum wallet address</li>
          <li>Supports <a href="https://ens.domains/">Ethereum Name Service (ENS)</a> in its metadata</li>
        </ul>
      </p>
    },
    {
      heading: "Why should I claim my Punk?",
      body: <p>Claiming your Synthetic Punk lets you:
        <ul>
          <li><b>Show it off</b> in your NFT collection alongside your other collectibles</li>
          <li><b>Trade</b> it on marketplaces such as OpenSea, Rarible, or Zora</li>
          <li><b>Supports</b> us in making more projects like this!</li>
        </ul>
      </p>
    }, 
    {
      heading: "Why can I claim random Punks?",
      body: <p>When you click the random button, it generates a brand new ethereum wallet on the fly. Because you can prove you own the wallet associated with the punk, you can claim it and have it sent to your actual ethereum wallet.</p>
    },
    {
      heading: "Why CryptoPunks?",
      body: <p>We believe that it should be possible for everyone to participate in the digital collectibles space. 
        CryptoPunks are the most recognizable and exclusive NFTs and the pixel art style of 
        CryptoPunks also makes it viable to store the required assets on-chain. These attributes made CryptoPunks 
        the obvious choice for this experiment.</p>
    }
  ]

  const [expanded, setExpanded] = useState<boolean[]>([...new Array(sections.length)].fill(false))

  return <div style={{width: "90%", maxWidth: "400px",marginBottom:"80px"}}>
    <div style={{marginBottom: "20px"}}>
      <h1 style={{padding: "5px"}}>FAQ</h1>
    </div>
    
    {sections.map((section, index) => {
      return <div key={index} style={{marginBottom: "20px", backgroundColor: "var(--lighter)", padding: "30px", borderRadius: "5px"}}>
        <div style={{display: "flex", margin: "-20px", padding: "20px", cursor: "pointer"}} onClick={() => {
          const expandedCopy = [...expanded]
          expandedCopy[index] = !expandedCopy[index]
          setExpanded(expandedCopy)
        }}>
          <h1 style={{display: "inline-block"}}>{section.heading}</h1> 
          <h1 style={{marginLeft: "auto", display: "inline-block"}}>{expanded[index] ? "–" : "+"}</h1>
        </div>
          {expanded[index] && <div style={{marginTop: "20px"}}>
          {section.body}
        </div>}
      </div>
    })}
  </div>
}