import classes from "./ListCard.module.css"

import { imageBackendUrl } from "../../utils/constants"
import { useNavigate } from "react-router-dom"

export default function ListCard({list}){
    const navigate = useNavigate()

    const reviewQnt = list.reviews.length

    return <div onClick={()=> navigate(`/list/${list._id}`)} className={classes["card"]}>
        <div className={classes["title-div"]}>
            <h3>{list.title}</h3>
        </div>

        <div className={classes["image-columns"]}>
            <div className={classes["image-rows"]}>

                {reviewQnt > 0 &&
                    <div className={classes["image-container"]}>
                        <img src={`${imageBackendUrl}/${list.reviews[0].imagesUrls[0]}`} alt="Review 1 image"/>
                    </div>
                }
                
                {reviewQnt > 2 &&
                    <div className={classes["image-container"]}>
                        <img src={`${imageBackendUrl}/${list.reviews[2].imagesUrls[0]}`} alt="Review 3 image"/>
                    </div>
                }
            </div>
            {reviewQnt > 1 && 
                <div className={classes["image-rows"]}>
                {reviewQnt > 1 &&
                    <div className={classes["image-container"]}>
                        <img src={`${imageBackendUrl}/${list.reviews[1].imagesUrls[0]}`} alt="Review 2 image"/>
                    </div>
                }
                {reviewQnt > 3 &&
                    <div className={classes["image-container"]}>
                        <img src={`${imageBackendUrl}/${list.reviews[3].imagesUrls[0]}`} alt="Review 4 image"/>
                    </div>
                }
            </div>
            }
            
        </div>

    </div>
}