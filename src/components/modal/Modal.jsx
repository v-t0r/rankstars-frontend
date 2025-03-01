import classes from "./Modal.module.css"
import { useRef, useEffect } from "react"
import { createPortal } from "react-dom"

import { motion } from "framer-motion"

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

    function handleEscape(e){
        // a ação de escape só afeta essa modal
        e.stopPropagation()
        onEscape()
    }

    return createPortal(
        <motion.dialog 
            ref={dialog} 
            className={classes["modal"]}
            onCancel={handleEscape}
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -30}}
        >
            {children}
        </motion.dialog>,
        document.getElementById("modal")
    )
}