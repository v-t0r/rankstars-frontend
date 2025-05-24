import classes from "./PostList.module.css"

import DetailedReviewCard from "../cards/reviewCard/DetailedReviewCard"
import DetailedListCard from "../cards/listCard/DetailedListCard"
import UserCard from "../cards/userCard/userCard"

export default function PostList({type = "reviews", posts = []}) {

    return <div className={classes["posts-section"]}>
        <ul>
            {posts.map(post => {
                return <li key={post._id}> 
                    {type === "reviews" && <DetailedReviewCard review={post} />}
                    {type === "lists" && <DetailedListCard list={post} />}
                    {type === "users" && <UserCard user={post} />}
                </li>
            })}
        </ul>
    </div>
}