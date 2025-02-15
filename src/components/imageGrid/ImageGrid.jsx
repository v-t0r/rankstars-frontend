import classes from "./ImageGrid.module.css"

import { imageBackendUrl } from "../../utils/constants"

export default function ImageGrid({images, size="14rem"}){

    const imagesQnt = images.length

    return <div className={classes["image-columns"]} style={{width: size}} >
        <div className={classes["image-rows"]} style={{height: size}}>

            {imagesQnt === 0 &&
                <div className={classes["image-container"]}>
                    <img src={`${imageBackendUrl}/images/empty-list-pic.jpg`} alt="Empty list picture"/>
                </div>
            }

            {imagesQnt > 0 &&
                <div className={classes["image-container"]}>
                    <img src={`${imageBackendUrl}/${images[0]}`} alt="Review 1 image"/>
                </div>
            }
            
            {imagesQnt > 2 &&
                <div className={classes["image-container"]}>
                    <img src={`${imageBackendUrl}/${images[2]}`} alt="Review 3 image"/>
                </div>
            }
        </div>
        {imagesQnt > 1 && 
            <div className={classes["image-rows"]} style={{height: size}}>
                {imagesQnt > 1 &&
                    <div className={classes["image-container"]}>
                        <img src={`${imageBackendUrl}/${images[1]}`} alt="Review 2 image"/>
                    </div>
                }
                {imagesQnt > 3 &&
                    <div className={classes["image-container"]}>
                        <img src={`${imageBackendUrl}/${images[3]}`} alt="Review 4 image"/>
                    </div>
                }
            </div>
        }
                
    </div> 
}