import classes from "./List.module.css"
 
import { Link, useParams } from "react-router-dom"
import { useQuery} from "@tanstack/react-query"

import { getPost } from "../services/posts.js"

import DetailedReviewCard from "../components/cards/DetailedReviewCard"
import OptionsBar from "../components/optionsBar/OptionsBar.jsx"
import CommentContainer from "../components/comments/CommentContainer.jsx"


export default function ListRoute(){
    const {id: listId} = useParams()

    const {data, isPending, isError} = useQuery({
        queryKey: ["list", `${listId}`],
        queryFn: ({signal}) => getPost({postId: listId, type: "lists", signal})
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
            
            <div className={classes["title-div"]}>
                <h1>{list.title}</h1>
                <h2>a list by <Link>{list.author.username}</Link></h2>
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