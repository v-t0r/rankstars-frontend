import classes from "./ReviewsPage.module.css"

import { useParams } from "react-router-dom"
import { useState } from "react"

import PostList from "../../components/postList/PostList"
import { fetchUserReviews } from "../../services/users"
import { useInfiniteQuery } from "@tanstack/react-query"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import LoadMoreSensor from "../../components/loadMoreObserver/LoadMoreObserver"

export default function ReviewsPage() {
    const [sortBy, setSortBy] = useState({sortBy: 'createdAt', order: -1})
    const {id} = useParams()

    const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: [ "reviews", "user", `${id}`, `${sortBy.sortBy}`, `${sortBy.order}`],
        queryFn: ({ signal, pageParam=1 }) => fetchUserReviews(signal, id, sortBy, pageParam),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.reviews.length == 0 ? undefined : allPages.length + 1
        }
    })

    let content
    if(isPending) {
        content = <>
            <LoaderDots />
        </>
    }
        
    if(isError) {
        content = <>
            <h2>Error while fetching this user reviews. Please, try again later.</h2>
        </>
    }

    if(data) { 
        const reviews = data.pages.map(page => page.reviews).flat(1) 
        content = <PostList type="reviews" posts={reviews} />
    }

    return <div className={classes["general-container"]}>
        <div className={classes["header-section"]}>   
            <h1>{"por nome aqui"}&apos;s reviews</h1>
            <div className={classes["select-div"]} >
                <label htmlFor="type"hidden>Sort by</label>
                <select id="type" value={JSON.stringify(sortBy)} onChange={(e) => setSortBy(JSON.parse(e.target.value))} >
                    <option value={JSON.stringify({sortBy: 'createdAt', order: -1})}>Newest Posts</option>
                    <option value={JSON.stringify({sortBy: 'createdAt', order: 1})}>Earliest Posts</option>
                    <option value={JSON.stringify({sortBy: 'rating', order: -1})}>Highest Ratings</option>
                    <option value={JSON.stringify({sortBy: 'rating', order: 1})}>Lowest Ratings</option>
                </select>
            </div>
        </div>
        
        {content}

        {isFetchingNextPage && <LoaderDots/>}

        <LoadMoreSensor fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}/>
        
        {(!hasNextPage && data?.pages.length > 1) &&
            <h3 className={classes["no-more-reviews-message"]}>It&apos;s a dead end! No more reviews to load.</h3>
        }

    </div>
}