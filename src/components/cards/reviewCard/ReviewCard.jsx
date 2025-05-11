import { useNavigate } from "react-router-dom"
import { imageBackendUrl } from "../../../utils/constants"

import classes from "./ReviewCard.module.css"
import { getRatingColorClass } from "../../../utils/functions"

export default function ReviewCard({review}){
    const navigate = useNavigate()

    const {boxColor, borderColor} = getRatingColorClass(review.rating)

    return (<>
        <div  onClick={() => navigate(`/review/${review._id}`)}  className={`${classes["card"]} ${borderColor}`}>
            <div className={classes["info"]}>
                <div className={classes["title-container"]}>
                    <h3>{review.title}</h3>
                </div>
                
                <div className={`${classes["rating-box"]} ${boxColor}`}>
                    <h3>{review.rating}</h3>
                </div>
            </div>
            
            <div className={classes["img-container"]} >
                <img src={`${imageBackendUrl}/${review.imagesUrls[0]}`} alt="Review image."/>
            </div>
        </div>
    </>
    )
}