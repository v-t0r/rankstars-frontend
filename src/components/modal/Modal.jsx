import classes from "./Modal.module.css"
import { useRef, useEffect } from "react"
import { createPortal } from "react-dom"

export default function Modal({ children, onEscape }){
    const dialog = useRef()

    //it renders open
    useEffect(() => {
        const modal = dialog.current
        modal.showModal()

        //closes when unmounted
        return () => {
            modal.close()
        }
    }, [])

    return createPortal(
        <dialog ref={dialog} className={classes["modal"]} onCancel={onEscape}>
            {children}
        </dialog>,
        document.getElementById("modal")
    )
}