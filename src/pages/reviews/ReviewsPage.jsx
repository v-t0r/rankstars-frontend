import classes from "./ReviewsPage.module.css"

import { useParams } from "react-router-dom"
import { useState } from "react"

import PostList from "../../components/postList/PostList"

export default function ReviewsPage() {
    const [sortBy, setSortBy] = useState({sortBy: 'createdAt', order: -1})
    const {id} = useParams()

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
        
        <PostList sortBy={sortBy} type="reviews" />
        
    </div>
}