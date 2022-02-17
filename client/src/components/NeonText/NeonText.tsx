import style from "./NeonText.module.css"
import neonHeader from'./NeonHeader.png';


interface NeonTextProps {
  text: string
}

export const NeonText = () => {
  return <div style={{textAlign: "center"}}>
    <div className={style.neonHeadCont} style={{marginTop:"60px"}}>
      <img alt="Synthetic Punk" src={neonHeader} className={style.neonHeadImg}></img>
    </div>

  </div>
}

