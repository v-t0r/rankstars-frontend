import { useRef } from "react"
import { imageBackendUrl } from "../../utils/constants"
import classes from "./ImagesPicker.module.css"

export default function ImagesPicker({inputName = undefined, inputId = "image", selectedImages, onChange, onRemove, multiple = true, maxImages = 10}){
    const fileInputRef = useRef(null)

    const totalImages = selectedImages.length

    //um array de undefined, apenas para fazer um map com containers vazios
    let undefinedArray
    if(totalImages < 4){
        undefinedArray = [ ...Array(4-totalImages)]
    }

    return <div className={classes["main-container"]}>
        <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            id={inputId} 
            name={inputName} 
            onChange={onChange} 
            multiple = {multiple}
        ></input>

        <div className={classes["image-section"]}>
            {!(selectedImages.length >= maxImages) && <div className={classes["image-container"]}>
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()} 
                    className={classes["add-image-button"]}
                >+</button>
            </div>}

            {selectedImages.map((image, index) => {
                return <div key={index} className={classes["image-container"]}>
                    <button type="button" onClick={() => onRemove({image, index})} className={classes["delete-button"]}>X</button>
                    <img src={typeof image === "string" ? `${imageBackendUrl}/${image}` : URL.createObjectURL(image)} alt="image preview" />
                </div>
            })}
            {/* Containers vazios para preencher o espaço restante */}
            {(totalImages < 4) && <> {undefinedArray.map((empty, index) => {
                    return <div key={index} className={classes["image-container"]}></div>
                })}
                </>
            }

        </div>
            
    </div>
}