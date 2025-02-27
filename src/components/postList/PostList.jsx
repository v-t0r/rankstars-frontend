import classes from "./PostList.module.css"

import { useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import { fetchUserLists, fetchUserReviews } from "../../services/users"
import DetailedReviewCard from "../cards/reviewCard/DetailedReviewCard"
import DetailedListCard from "../cards/listCard/DetailedListCard"
import LoaderDots from "../loaderDots/LoaderDots"

export default function PostList({sortBy, type = "reviews"}) {
    const {id} = useParams()
    
    const { data, isPending, isError } = useQuery({
        queryKey: [type, "user", `${id}`, `${sortBy.sortBy}`, `${sortBy.order}`],
        queryFn: ({signal}) => type === "reviews" ? fetchUserReviews(signal, id, sortBy) : fetchUserLists(signal, id)
    })

    let content
    if(isPending) {
        content = <>
            <LoaderDots />
        </>
    }
     
    if(isError) {
        content = <>
            <h2>Error while fetching this user {type}. Please, try again later.</h2>
        </>
    }

    if(data) { 
        const posts = type === "reviews" ? data.reviews : data.lists

        content = <>            
            <ul>
                {posts.map(post => {
                    return <li key={post._id}> 
                        {type === "reviews" ? <DetailedReviewCard review = {post} /> : <DetailedListCard list={post} />} 
                    </li>
                })}
            </ul>
        </>
    }

    return <div className={classes["posts-section"]}>
        
        {content}
    </div>
}