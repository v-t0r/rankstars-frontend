import { useParams } from "react-router-dom"
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

    const {data, isPending, isError, error} = useQuery({
        queryKey: ["review", `${reviewId}`],
        queryFn: ({signal}) => getPost({postId: reviewId, type: "reviews", signal}),
        retry: false,
        staleTime: 0
    })

    let content

    if(isPending) {
        content = <LoaderDots />
    }

    if(isError) {
        content = <ErrorCard 
            title={error.status === 404 ? "404: Review Not Found!" : undefined} 
            message={error.status === 404 ? "Are you sure this is the address you are looking for?" : undefined}
        />
    }

    if(data) {
        const review = data.review

        content = <>
            <div className={classes["general-container"]}>
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