import { useState } from "react"
import { imageBackendUrl } from "../../utils/constants"

import classes from "./ImageCarousel.module.css"

import { motion } from "framer-motion"

export default function ImageCarousel({onClose, images = []}) {
    
    const [selectedImage, setSelectedImage] = useState(0)


    const arrowButtonVariants = {
        hover: {scale: 1.3}
    }

    return <div className={classes["main-container"]}>
        <button 
            type="button"
            className="negative-button" 
            style={{alignSelf: "end", width: "fit-content"}}
            onClick={onClose}
        >
            X
        </button>
        
        <div className={classes[["selected-image-container"]]}>
            <motion.div 
                whileHover="hover" 
                className={`${classes["arrow-button"]} ${classes["left-button"]}`}
                onClick={() => setSelectedImage(prev => prev === 0 ? (images.length-1) : prev-1)}
            >
                <motion.span variants={arrowButtonVariants} className="material-symbols-outlined">
                    arrow_back_ios
                </motion.span>
            </motion.div>
            <img src={`${imageBackendUrl}/${images[selectedImage]}`} alt="selected image"/>
            <motion.div 
                whileHover="hover" 
                className={`${classes["arrow-button"]} ${classes["right-button"]}`}
                onClick={() => setSelectedImage(prev => (prev+1) % images.length) }
            >
                <motion.span variants={arrowButtonVariants} className="material-symbols-outlined">
                    arrow_forward_ios
                </motion.span>
            </motion.div>
        </div>
        
        <div className={classes["preview-images-section"]}>
            {images.map((image, index) => {
                return <div key={index} className={`${classes["image-container"]} ${selectedImage === index ? classes["selected-image"] : undefined}`}>
                    <img 
                        src={`${imageBackendUrl}/${image}`} 
                        alt={`image ${index}`} 
                        onClick={() => setSelectedImage(index)}
                    />
                </div>
            })}
        </div>
    </div>
}