import classes from "./PostList.module.css"

import DetailedReviewCard from "../cards/reviewCard/DetailedReviewCard"
import DetailedListCard from "../cards/listCard/DetailedListCard"

export default function PostList({type = "reviews", posts}) {

    return <div className={classes["posts-section"]}>
        <ul>
            {posts.map(post => {
                return <li key={post._id}> 
                    {type === "reviews" ? <DetailedReviewCard review = {post} /> : <DetailedListCard list={post} />} 
                </li>
            })}
        </ul>
    </div>
}