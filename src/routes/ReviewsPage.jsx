import classes from "./ReviewsPage.module.css"

import { useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import { fetchUserReviews } from "../util/fetch/users"
import DetailedReviewCard from "../components/cards/DetailedReviewCard"
import { useState } from "react"


export default function ReviewsPage() {
    const [sortBy, setSortBy] = useState({sortBy: 'createdAt', order: -1})
    const {id} = useParams()

    const { data, isPending, isError } = useQuery({
        queryKey: ["reviews", "user", `${id}`, `${sortBy.sortBy}`, `${sortBy.order}`],
        queryFn: ({signal}) => fetchUserReviews(signal, id, sortBy)
    })

    let content
    if(isPending) {
        content = <>
            <p>Loading reviews...</p>
        </>
    }
     
    if(isError) {
        content = <>
            <h2>Error while fetching this user reviews. Please, try again later.</h2>
        </>
    }

    if(data) { 
        const reviews = data.reviews

        content = <>
            <div className={classes["header-section"]}>   
                <h1>{reviews[0].author.username}&apos;s reviews</h1>
                <div className={classes["select-div"]} >
                    <label htmlFor="type"hidden>Sort by</label>
                    <select id="type" value={JSON.stringify(sortBy)} onChange={(e) => setSortBy(JSON.parse(e.target.value))} >
                        <option value={JSON.stringify({sortBy: 'createdAt', order: -1})}>Newest Posts</option>
                        <option value={JSON.stringify({sortBy: 'createdAt', order: 1})}>Earliest Posts</option>
                        <option value={JSON.stringify({sortBy: 'rating', order: 1})}>Highest Ratings</option>
                        <option value={JSON.stringify({sortBy: 'rating', order: -1})}>Lowest Ratings</option>
                    </select>
                </div>
            </div>
            
            <ul>
                {reviews.map(review => {
                    return <li key={review._id}> <DetailedReviewCard review = {review} /> </li>
                })}
            </ul>
        </>
    }

    return <div className={classes["reviews-section"]}>
        
        {content}
    </div>
}