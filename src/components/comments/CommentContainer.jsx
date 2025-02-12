import classes from "./CommentContainer.module.css"

import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "../../services/comments"
import CommentCard from "./CommentCard"
import { useDispatch, useSelector } from "react-redux"
import { commentsAction } from "../../store"
import { useEffect } from "react"

export default function CommentContainer({postId, type}){
    const dispatch = useDispatch()

    const {data, isPending, isError, error} = useQuery({
        queryKey: [type.slice(0, -1), "comments", `${postId}`],
        queryFn: ({ signal }) => fetchComments({id: postId, type: type, answers: true, signal}),
    })

    let content

    if(isPending) {
        content = <>
            <h1>Comments</h1>
            <p>Loading comments...</p>
        </>
    }

    if(isError) {
        content = <>
            <h1>Comments</h1>
            <p>{error.message}</p>
        </>
    }

    useEffect(() => {
        //estabelecendo um contexto para os comentários.
        dispatch(commentsAction.defineCurrentComments(data))

        return () => {
            dispatch(commentsAction.defineCurrentComments([]))
        }

    }, [data, dispatch])

    const comments = useSelector(state => state.comments)

    if(data) {  
    
        let primaryComments = comments.length
        const totalComments = comments.reduce((accumulator, comment) => accumulator + comment.comments.length, primaryComments)

        content = <div className={classes["comment-container"]}>
            <h1>Comments ({totalComments})</h1>
            {comments.map(comment => <CommentCard key={comment._id} comment={comment}/>)}
            {!totalComments && 
                <>
                    <p>It looks like no one has been here before!</p>
                    <p>Why not start a discussion?</p>
                </>
            }
        </div>
    }

    return <>
        {content}
    </>
}