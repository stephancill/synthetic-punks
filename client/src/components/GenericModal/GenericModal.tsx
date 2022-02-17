import style from "./GenericModal.module.css"
import {useEffect} from "react"

interface IGenericModalProps {
  shouldShow: boolean
  setShouldShow: (visible: boolean) => void,
  content: JSX.Element
}

export const GenericModal = ({shouldShow, setShouldShow, content}: IGenericModalProps) => {

  useEffect(() => {
    if (shouldShow) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [shouldShow])

  return <div style={{display: shouldShow ? "block" : "none"}}> 
    <div onClick={() => {setShouldShow(!shouldShow)}} 
    style={{backgroundColor: "var(--shadow)", opacity: "0.7", zIndex: "1"}} className={style.fullscreenModal}></div>
    <div className={style.fullscreenModal}>
      <div className={style.modalContainer}>
        {content}
      </div>
    </div>
  </div>
}