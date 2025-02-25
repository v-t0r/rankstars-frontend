import classes from "./ListPage.module.css"
 
import { useState } from "react"

import { Link, useParams } from "react-router-dom"
import { useQuery} from "@tanstack/react-query"

import { getPost } from "../../services/posts.js"

import DetailedReviewCard from "../../components/cards/DetailedReviewCard.jsx"
import OptionsBar from "../../components/optionsBar/OptionsBar.jsx"
import CommentContainer from "../../components/comments/CommentContainer.jsx"

export default function ListRoute(){
    const {id: listId} = useParams()

    const [sortBy, setSortBy] = useState({sortBy: 'userOrder', order: null})

    const {data, isPending, isError} = useQuery({
        queryKey: ["list", `${listId}`, `${sortBy.sortBy}`, `${sortBy.order}`],
        queryFn: ({signal}) => getPost({postId: listId, type: "lists", signal, sortBy: sortBy})
    })

    let content
    if(isPending){
        content = <p>Loading list...</p>
    }

    if(isError){
        content = <p>Error while loading this list.</p>
    }

    if(data){
        const list = data.list

        content = <div className={classes["main-container"]}>
            
            <div className={classes["header-div"]}>
                <div className={classes["title-div"]}>
                    <h1>{list.title}</h1>
                    <h2>a list by <Link to={`/profile/${list.author._id}`}>{list.author.username}</Link></h2>
                </div>
                <div className={classes["select-div"]} >
                    <label htmlFor="type"hidden>Sort by</label>
                    <select id="type" value={JSON.stringify(sortBy)} onChange={(e) => setSortBy(JSON.parse(e.target.value))} >
                        
                        <option value={JSON.stringify({sortBy: 'userOrder', order: null})}>User Order</option>
                        <option value={JSON.stringify({sortBy: 'createdAt', order: -1})}>Newest Posts</option>
                        <option value={JSON.stringify({sortBy: 'createdAt', order: 1})}>Earliest Posts</option>
                        <option value={JSON.stringify({sortBy: 'rating', order: -1})}>Highest Ratings</option>
                        <option value={JSON.stringify({sortBy: 'rating', order: 1})}>Lowest Ratings</option>

                    </select>
                </div>
            </div>
            
            
            <div className={classes["reviews-div"]}>
                <ul>
                    {list.reviews.map(review => {
                        return <li key={review._id} ><DetailedReviewCard review={review}/></li>
                    })}
                </ul>
            </div>
            
            <div className={classes["options-bar-div"]}>
                <OptionsBar post={list} type={"lists"} />
            </div>

            <CommentContainer postId = {list._id} type="lists"/>

        </div>
    }

    return <>
        {content}
        

    </>
}