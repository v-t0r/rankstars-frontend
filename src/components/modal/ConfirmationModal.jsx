import classes from "./ConfirmationModal.module.css"
import Modal from "./Modal"

export default function ConfirmationModal({title, message, onConfirm, onCancel, onClose}){

    return <Modal onClose={onClose}>
        <div className={classes["confirmation-modal"]}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={classes["buttons"]}>
            <button onClick={onCancel} className="negative-button">No</button>
            <button onClick={onConfirm} className="button">Yes</button>
        </div>
        </div>
    </Modal>
}