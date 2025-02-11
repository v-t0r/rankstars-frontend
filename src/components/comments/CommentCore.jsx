import { Link } from "react-router-dom"
import { imageBackendUrl } from "../../util/http"
import classes from "./CommentCore.module.css"
import { useState } from "react"
import OverflowMenu from "../overflowMenu/overflowMenu"
import { useDispatch, useSelector } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import { deleteComment } from "../../util/fetch/comments"
import { commentsAction } from "../../store"

export default function CommentCore({comment, type = "comment", onReplyClick}){
    const loggedUserInfo = useSelector(state => state.user.user)
    const dispatch = useDispatch()

    const {mutate: deleteMutate} = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            if(type === "comment"){
                dispatch(commentsAction.deleteComment({_id: comment._id}))
            }
            if(type === "answer"){
                dispatch(commentsAction.deleteAnswer({_id: comment._id, where: comment.where}))
            }
        }
    })
    
    const [overflowMenuVisibility, setOverflowMenuVisibility] = useState(false)

    return <div className={classes["comment-card"]}>
        <div>
            <div className={classes["author-div"]}>
                <img src={`${imageBackendUrl}/${comment.author.profilePicUrl}`} alt={`${comment.author.username}'s profile picture`}></img>
                <Link to={`/profile/${comment.author._id}`}>{comment.author.username}</Link>
                <p>at {new Date(comment.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                    })}
                </p>
            </div>
            <div className={classes["comment-div"]}>
                <p>{comment.content}</p>
            </div>
        </div>
        
        <div className={classes["options-column"]}>
            <button onClick={() => setOverflowMenuVisibility(state => !state) }><span className={`material-symbols-outlined`}>more_vert</span></button>
            <button><span className={`material-symbols-outlined`}>keyboard_arrow_up</span></button>
            <p>0</p>
            <button><span className={`material-symbols-outlined`}>keyboard_arrow_down</span></button>
            {type === "comment" && <button onClick={onReplyClick}><span className={`material-symbols-outlined`}>comment</span></button>}
        </div>

        {overflowMenuVisibility && <OverflowMenu right={"0"} bottom={"50px"} handleCloseMenu={() => setOverflowMenuVisibility(false)}>
                <ul className={classes["overflow-menu-list"]}>
                    {loggedUserInfo._id === comment.author._id && 
                        <li>
                            <button onClick={() => deleteMutate({id: comment._id})} className="negative-button">
                                <span className= {`material-symbols-outlined ${classes["delete-icon"]}`}>delete</span>Delete
                            </button>
                        </li>
                    } 
                </ul>
            </OverflowMenu>}
    </div>
}