import style from "./NeonText.module.css"
import neonHead from'./NeonHead.png';

interface NeonTextProps {
  text: string
}

export const NeonText = ({text} : NeonTextProps) => {
  return <div style={{textAlign: "center"}}>
    <div className={style.neonHeadCont} style={{marginTop:"60px"}}>
      <img alt="Synthetic Punk" src={neonHead} className={style.neonHeadImg}></img>
    </div>
    <h1 className={style.neonGlow} style={{marginTop:"30px"}}>
      {text}
    </h1>
    <h2 className={style.neonText1} style={{marginTop:"-30px"}}>
    CryptoPunks for everyone
    </h2>
  </div>
}

