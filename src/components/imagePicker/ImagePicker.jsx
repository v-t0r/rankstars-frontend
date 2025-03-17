import { useRef } from "react"
import { backendUrl, imageBackendUrl } from "../../utils/constants"
import classes from "./ImagePicker.module.css"

export default function ImagePicker({inputName = undefined, inputId = "image", selectedImage, onChange, onRemove}){
    const fileInputRef = useRef(null)

    return <div className={classes["main-container"]}>
        <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            id={inputId} 
            name={inputName} 
            onChange={onChange} 
        ></input>

        <div className={classes["image-section"]}>

            <div className={classes["image-container"]}>
                <button
                    type="button" 
                    onClick={() => fileInputRef.current.click()} 
                >
                    <span className={`material-symbols-outlined ${classes["edit-icon"]}`}>edit_square</span>
                </button>
                {!selectedImage && <img src={`${imageBackendUrl}/images/default-profile-pic.jpg`} />}
                {selectedImage && <img src={typeof selectedImage === "string" ? `${imageBackendUrl}/${selectedImage}` : URL.createObjectURL(selectedImage)} alt="image preview" />}
            </div>

        </div>
            
    </div>
}