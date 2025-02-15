import classes from "./DetailedReviewCard.module.css"

import { imageBackendUrl } from "../../utils/constants"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getRatingColorClass } from "../../utils/functions"
import { useRef, useState } from "react"

export default function DetailedReviewCard({review, reviewPage = false}) {   

    const location = useLocation()
    const navigate = useNavigate()
    const { boxColor } = getRatingColorClass(review.rating)

    const [horizontalImage, setHorizontalImage] = useState(false)

    const imageRef = useRef()

    function handleImageAspectRatio(){
        //this function makes shure that horizontal images shows as a square
        const {naturalWidth, naturalHeight} = imageRef.current
        setHorizontalImage(naturalHeight < naturalWidth)
    }

    const clampTextStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 10,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }

    return <div className={classes["card"]}>
        <div className={classes["img-and-info"]}>
            <div 
                onClick={() => navigate(`/review/${review._id}`, { state: { prevPage: location.pathname, linkText: "back" }})} 
                className={classes["img-container"]}
            >
                <img 
                    ref={imageRef} 
                    src={`${imageBackendUrl}/${review.imagesUrls[0]}`} 
                    alt="Review Image"
                    onLoad={handleImageAspectRatio}
                    style={horizontalImage ? { aspectRatio: "1/1" } : {}}     
                />
            </div>

            <div className={classes["review-info"]}>
                <div className={classes["title-container"]}>
                    {reviewPage && <h3>{review.title}</h3>}
                    {!reviewPage && <Link to= {`/review/${review._id}`} state={ {prevPage: location.pathname, linkText: "back"} } ><h3>{review.title}</h3></Link>}
                </div>
                <div className={classes["author"]}>
                    <Link to={`/profile/${review.author._id}`}>{review.author.username}</Link>

                </div>
                <div className={classes["review-text"]}>
                    <p style={!reviewPage ? clampTextStyle : {}}>{review.review}</p>
                </div>
                
            </div>
        </div>
        <div className={classes["rating-container"]}>
            {!reviewPage && <Link to={`/review/${review._id}`}>See more</Link>}
            <p className={boxColor}>{review.rating}</p>
        </div>

    </div>
}