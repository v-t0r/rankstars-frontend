import { useRef, useState } from "react"
import { imageBackendUrl } from "../../utils/constants"

import classes from "./ImageCarousel.module.css"

import { motion } from "framer-motion"

export default function ImageCarousel({onClose, images = []}) {
    
    const [selectedImage, setSelectedImage] = useState(0)
    const imageRefs = useRef([])


    const arrowRightButtonVariants = {
        hover: {scale: 1.3, x: 5}
    }

    const arrowLeftButtonVariants = {
        hover: {scale: 1.3, x: -5}
    }

    function handleChangeSelectedImage(newIndex){
        setSelectedImage(newIndex)
        imageRefs.current[newIndex].scrollIntoView({behavior: "smooth", inline: "center"})
    }

    return <div className={classes["main-container"]}>
        <button 
            type="button"
            className="negative-button" 
            style={{alignSelf: "end", width: "fit-content", fontSize: "20px"}}
            onClick={onClose}
        >
            X
        </button>
        
        <div className={classes[["selected-image-container"]]}>
            <motion.div 
                whileHover="hover" 
                className={`${classes["arrow-button"]} ${classes["left-button"]}`}
                onClick={() => handleChangeSelectedImage(selectedImage === 0 ? (images.length-1) : selectedImage-1)}
            >
                <motion.span variants={arrowLeftButtonVariants} className="material-symbols-outlined">arrow_back_ios</motion.span>
            </motion.div>
            <img src={`${imageBackendUrl}/${images[selectedImage]}`} alt="selected image"/>
            <motion.div 
                whileHover="hover" 
                className={`${classes["arrow-button"]} ${classes["right-button"]}`}
                onClick={() => handleChangeSelectedImage( (selectedImage+1) % images.length) }
            >
                <motion.span variants={arrowRightButtonVariants} className="material-symbols-outlined">arrow_forward_ios</motion.span>
            </motion.div>
        </div>
        
        <div className={classes["preview-images-section"]}>
            {images.map((image, index) => {
                return <div key={index} className={classes["image-container"]}>
                    <img 
                        ref={(e) => imageRefs.current[index] = e}
                        src={`${imageBackendUrl}/${image}`} 
                        alt={`image ${index}`} 
                        onClick={() => handleChangeSelectedImage(index)}
                        className={`${selectedImage === index ? classes["selected-image"] : undefined}`}
                        
                    />
                </div>
            })}
        </div>
    </div>
}