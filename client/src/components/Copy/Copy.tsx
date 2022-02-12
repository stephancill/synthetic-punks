import { useEffect } from "react"
import style from "./Copy.module.css"


export const Copy = () => {
  useEffect(() => {
  });

  // const showText = (id <string>) => {
  //   console.log(id)
  //   const element = document.getElementById(id)
  //   element?.style.backgroundColor =
    
  // }

  return <div className={style.container}>
    <div className={style.textContainer}>
      <div style={{width:"580px",borderLeft:"1px solid white",paddingLeft:"20px"}}>
      {/* onClick={()=>{showText("whatAreSynth")}} */}

        <input type="checkbox" id="one" className={style.one}></input>
        <label htmlFor="one" className={style.text} >
        <h2 className={style.h2}>What are SyntheticPunks?</h2>
        </label>
        <div id="conOne" className={style.conOne}>
          <h3 className={style.text}>
          <b>Synthetic CryptoPunks (sPunks)</b> are inspired by the historical collection of 10,000 CryptoPunks by Larva Labs and Synthetic Loot by dhof. It generates a unique, fully on-chain CryptoPunk for each Ethereum address.
          </h3>
          <h3 className={style.text}>
          They are free to view for any address, but can be claimed as an ERC-721 NFT for a price of 0.02 ether.
          </h3>
        </div>

        <input type="checkbox" id="two" className={style.two}></input>
        <label htmlFor="two" className={style.text} >
        <h2 className={style.h2} style={{marginTop:"20px"}}>Features</h2>
        </label>
        <div id="conTwo" className={style.conTwo}>
          <h3 className={style.text}>
          Each sPunk
          </h3>
          <ul>
            <li>Is generated from assets stored fully on chain (no external storage)</li>
            <li>Is uniquely associated with your wallet address</li>
            <li>Contains the ENS name or address of the claimer in its metadata</li>
          </ul>
        </div>

        <input type="checkbox" id="three" className={style.three}></input>
        <label htmlFor="three" className={style.text} >
        <h2 className={style.h2} style={{marginTop:"20px"}}>Why should I claim my sPunk?</h2>
        </label>
        <div id="conThree" className={style.conThree}>
          <h3 className={style.text}>
          Claiming your sPunk lets you:
          </h3>
          <ul>
            <li><b>Show it off</b> in your NFT collection alongside your other collectibles</li>
            <li><b>Trade </b> it on marketplaces such as OpenSea, Rarible, or Zora</li>
            <li><b>Helps us</b> Helps us cover our gas costs and fund future projects like this!</li>
          </ul>
        </div>

        <input type="checkbox" id="four" className={style.four}></input>
        <label htmlFor="four" className={style.text} >
        <h2 className={style.h2} style={{marginTop:"20px"}}>Why use CryptoPunk assets?</h2>
        </label>
        <div id="conFour" className={style.conFour}>
          <h3 className={style.text}>
          We believe that it should be possible for everyone to participate in the digital collectibles space. CryptoPunks are the most recognizable and exclusive NFTs in the blockchain space and the pixel art style of CryptoPunks also makes is viable to store the required assets on-chain. These attributes made CryptoPunks the obvious choice for this experiment.
          </h3>
        </div>
      </div>
  
    </div>
    <div className={style.textContainer} style={{marginTop:"80px", marginLeft:"-0px"}}>
      <h4 className="footText">
        Made by <a href="https://twitter.com/stephancill">@stephancill</a> and <a href="https://twitter.com/npm_luko">@npm_luko</a>
      </h4> 
    </div>
  </div>
}

