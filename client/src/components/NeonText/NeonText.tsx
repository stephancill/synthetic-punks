import style from "./NeonText.module.css"
import neonHeader from'./../../img/NeonHeader.jpg';


export const NeonText = () => {
  return <div style={{textAlign: "center"}}>
    <a href="/">
    <div className={style.neonHeadCont} style={{marginTop:"60px"}}>
      <img alt="Synthetic Punk" src={neonHeader} className={style.neonHeadImg}></img>
    </div>
    </a>
  </div>
}

