import { useEffect, useState } from "react"
import style from "./NeonText.module.css"
import neonHead from'./NeonHead.png';


interface NeonTextProps {
  text: string
}

const neonClasses = [style.neonText1, style.neonText2]

export const NeonText = ({text} : NeonTextProps) => {
  const [seconds, setSeconds] = useState(1);
  const [counter, setCounter] =  useState<number>(0);

  console.log(style)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(counter + 1)
    }, 1000);
    return () => clearInterval(timer);
  });

  return <div>
    <div className={style.neonHeadCont} style={{marginTop:"60px"}}>
      <img src={neonHead} className={style.neonHeadImg}></img>
    </div>
    <h1 className={neonClasses[counter%neonClasses.length]} style={{marginTop:"30px"}}>
      {text}
    </h1>
  </div>
}

