import classes from "./ConfirmationModal.module.css"
import Modal from "./Modal"

import { motion } from "framer-motion"

export default function ConfirmationModal({title, message, onConfirm, onCancel, onEscape}){

    return <Modal onClose={onEscape}>
        <div className={classes["confirmation-modal"]}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={classes["buttons"]}>
            <button onClick={onCancel} className="text-button">No</button>
            <motion.button onClick={onConfirm} className="button" whileHover={{backgroundColor: "var(--error-color)"}} >Yes</motion.button>
        </div>
        </div>
    </Modal>
}