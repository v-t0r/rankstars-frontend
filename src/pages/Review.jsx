import { Link, useParams } from "react-router-dom"
import { getPost } from "../services/posts"
import { useQuery } from "@tanstack/react-query"

import classes from "./Review.module.css"
import OptionsBar from "../components/optionsBar/OptionsBar"
import DetailedReviewCard from "../components/cards/DetailedReviewCard"
import CommentContainer from "../components/comments/CommentContainer"
 
export default function ReviewRoute(){
    const {id: reviewId} = useParams()

    const {data, isPending, isError, error} = useQuery({
        queryKey: ["review", `${reviewId}`],
        queryFn: ({signal}) => getPost({postId: reviewId, type: "reviews", signal})
    })

    let content

    if(isPending) {
        content = <p>Loading review info...</p>
    }

    if(isError) {
        content = <p>{error.message}</p>
    }

    if(data) {
        const review = data.review

        content = <>
            <div className={classes["general-container"]}>
                <Link className={classes["back-link"]} to={`/profile/${review.author._id}/reviews`} >
                    <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>arrow_back</span>
                    all reviews
                </Link>
                <div className={classes["review-div"]}>
                    <DetailedReviewCard review={review} reviewPage={true} />
                </div>
                

                <div className={classes["options-bar-div"]}>
                    <OptionsBar post={review} type={"reviews"}/>
                </div>
                

                <CommentContainer postId = {review._id} type={"reviews"} />

            </div>
        
        </>
    }

    return <>
        {content}
    </>
}