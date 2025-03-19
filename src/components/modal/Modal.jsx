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
        if(e.target.type === "file") return // triggered by the file select window

        e.stopPropagation()
        onEscape()
    }

    return createPortal(
        <motion.dialog 
            ref={dialog}
            className={classes["modal"]}
            style={{zIndex: "500"}}
            onCancel={handleEscape}
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, y: -30}}
            layout
            transition={{type: "spring", bounce: 0.5, duration: 0.5}}
        >
            {children}
        </motion.dialog>,
        document.getElementById("modal")
    )
}