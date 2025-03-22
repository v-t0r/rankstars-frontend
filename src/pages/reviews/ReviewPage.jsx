import { Link, useLocation, useParams } from "react-router-dom"
import { getPost } from "../../services/posts"
import { useQuery } from "@tanstack/react-query"

import classes from "./ReviewPage.module.css"
import OptionsBar from "../../components/optionsBar/OptionsBar"
import DetailedReviewCard from "../../components/cards/reviewCard/DetailedReviewCard"
import CommentContainer from "../../components/comments/CommentContainer"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import ErrorCard from "../../components/errorCard/ErrorCard"
 
export default function ReviewPage(){
    const {id: reviewId} = useParams()
    const location = useLocation()

    const {data, isPending, isError} = useQuery({
        queryKey: ["review", `${reviewId}`],
        queryFn: ({signal}) => getPost({postId: reviewId, type: "reviews", signal}),
        staleTime: 0
    })

    let content

    if(isPending) {
        content = <LoaderDots />
    }

    if(isError) {
        content = <ErrorCard />
    }

    if(data) {
        const review = data.review

        content = <>
            <div className={classes["general-container"]}>
                <Link className={classes["back-link"]} to={location.state ? location.state.prevPage : "/"} >
                    <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>arrow_back</span>
                    {location.state ? location.state.linkText : "back"}
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