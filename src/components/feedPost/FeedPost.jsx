import classes from "./FeedPost.module.css"

import DetailedReviewCard from "../cards/reviewCard/DetailedReviewCard"
import DetailedListCard from "../cards/listCard/DetailedListCard"
import { Link } from "react-router-dom"
import { imageBackendUrl } from "../../utils/constants"
import { feedFormatedDate } from "../../utils/functions"


export default function FeedPost({post}) {
    return <div className={classes["card"]}>
        <div className={classes["post-header"]}>
            <div className={classes["author-div"]}>
                <div className={classes["image-container"]}>
                    <img src={`${imageBackendUrl}/${post.author.profilePicUrl}`} alt={`${post.author.username}' profile picture.`} />
                </div>
                <p><Link>{post.author.username}</Link> {post.type == "review" ? "posted a new review"  : "created a new list"}</p>

            </div>
            
           <p id={classes["date"]} >{feedFormatedDate(post.createdAt)}</p>
        </div>
        <div className={classes["post-div"]}>
            {post.type == "review" ? <DetailedReviewCard review={post} /> : <DetailedListCard list={post} />}
        </div>
    </div>
}