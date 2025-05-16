import { Link } from "react-router-dom"
import { imageBackendUrl } from "../../utils/constants"
import classes from "./CommentCore.module.css"
import { useState } from "react"
import OverflowMenu from "../overflowMenu/overflowMenu"
import { useDispatch, useSelector } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import { addCommentVote, deleteComment, rremoveCommentVote } from "../../services/comments"
import { commentsAction, loginModalActions } from "../../store"
import Modal from "../modal/Modal"
import EditCommentForm from "./editCommentForm/editCommentForm"
import { AnimatePresence } from "framer-motion"

export default function CommentCore({comment, type = "comment", onReplyClick}){
    const loggedUserInfo = useSelector(state => state.user.user)
    const dispatch = useDispatch()

    const [modalsVisibility, setModalsVisibility] = useState({
        overflowMenu: false,
        editModal: false
    })

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

    const {mutate: addVoteMutate} = useMutation({
        mutationFn: addCommentVote,
        onSuccess: (_data, variables) => {
            if(variables.voteType === "upvotes"){
                dispatch(commentsAction.addUpVote({comment, userId: loggedUserInfo._id}))
            }
            if(variables.voteType === "downvotes"){
                dispatch(commentsAction.addDownVote({comment, userId: loggedUserInfo._id}))
            }
        }
    })

    const {mutate: removeVoteMutate} = useMutation({
        mutationFn: rremoveCommentVote,
        onSuccess: (_data, variables) => {
            if(variables.voteType === "upvotes"){
                dispatch(commentsAction.removeUpVote({comment, userId: loggedUserInfo._id}))
            }
            if(variables.voteType === "downvotes"){
                dispatch(commentsAction.removeDownVote({comment, userId: loggedUserInfo._id}))
            }
        }
    })

    function handleVote(voteType){
        if( voteType === "upvotes" && (!comment.upVotes.includes(loggedUserInfo._id)) ){
            addVoteMutate({id: comment._id, voteType})
        }
        if( voteType === "upvotes" && (comment.upVotes.includes(loggedUserInfo._id)) ){
            removeVoteMutate({id: comment._id, voteType})
        }

        if(voteType === "downvotes" && (!comment.downVotes.includes(loggedUserInfo._id)) ){
            addVoteMutate({id: comment._id, voteType})
        }
        if( voteType === "downvotes" && (comment.downVotes.includes(loggedUserInfo._id)) ){
            removeVoteMutate({id: comment._id, voteType})
        }
    }
    
    return <div className={classes["comment-card"]}>
        <div className={classes["content-div"]}>
            <div className={classes["author-div"]}>
                <div className={classes["image-container"]}>
                    <img src={`${imageBackendUrl}/${comment.author.profilePicUrl}`} alt={`${comment.author.username}'s profile picture`}></img>
                </div>
                
                <Link to={`/profile/${comment.author._id}`}>{comment.author.username}</Link>
                <p>at {new Date(comment.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                    })} {comment.isEdited && " - edited"}
                </p>
            </div>
            <div className={classes["comment-div"]}>
                <p>{comment.content}</p>

            </div>
        </div>
        
        <div className={classes["options-column"]}>
            {loggedUserInfo?._id === comment.author._id && <button onClick={() => setModalsVisibility(prev => ({...prev, overflowMenu: !prev.overflowMenu}))}><span className={`material-symbols-outlined`}>more_vert</span></button>}
            <button 
                className={`${comment.upVotes.includes(loggedUserInfo?._id) ? classes["up-voted"] : undefined}`}
                onClick={() => loggedUserInfo ? handleVote("upvotes") : dispatch(loginModalActions.setLoginModalVisibility(true))}
            >
                <span className={`material-symbols-outlined`}>keyboard_arrow_up</span>
            </button>
            <p>{comment.upVotesCount - comment.downVotesCount}</p>
            <button 
                className={`${comment.downVotes.includes(loggedUserInfo?._id) ? classes["down-voted"] : undefined}`}
                onClick={() => loggedUserInfo ? handleVote("downvotes") : dispatch(loginModalActions.setLoginModalVisibility(true))}
            >
                <span className={`material-symbols-outlined`}>keyboard_arrow_down</span>
            </button>
            {type === "comment" && <button onClick={onReplyClick}><span className={`material-symbols-outlined`}>comment</span></button>}
        </div>

        <AnimatePresence>
            {modalsVisibility.overflowMenu && <OverflowMenu right={"0"} top={"25px"} handleCloseMenu={() => setModalsVisibility(prev => ({...prev, overflowMenu: !prev.overflowMenu}))}>
                <ul className={classes["overflow-menu-list"]}>
                    {loggedUserInfo?._id === comment.author._id && <>
                        <li>
                            <button onClick={() => {setModalsVisibility(prev => ({...prev, overflowMenu: false, editModal: true}))}} className="text-button">
                                <span className= {`material-symbols-outlined ${classes["delete-icon"]}`}>edit</span>Edit
                            </button>
                        </li>

                        <li>
                            <button onClick={() => deleteMutate({id: comment._id})} className="negative-button">
                                <span className= {`material-symbols-outlined ${classes["delete-icon"]}`}>delete</span>Delete
                            </button>
                        </li>
                    </>} 
                </ul>
            </OverflowMenu>}

            {modalsVisibility.editModal && <Modal onEscape={() => setModalsVisibility(prev => ({...prev, editModal: false}))}>
                <EditCommentForm 
                    comment={comment}
                    onCancel={() => setModalsVisibility(prev => ({...prev, editModal: false}))}
                />
            </Modal>}
        </AnimatePresence>
    </div>
}