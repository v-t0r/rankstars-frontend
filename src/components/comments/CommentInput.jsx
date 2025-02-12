import { useRef } from "react"
import classes from "./CommentInput.module.css"
import { useMutation } from "@tanstack/react-query"
import { postComment } from "../../services/comments"
import { useDispatch, useSelector } from "react-redux"
import { commentsAction } from "../../store"

export default function CommentInput({parent, type}){
    const sendButtonRef = useRef()
    const commentTextAreaRef = useRef()

    const loggedUserInfo = useSelector(state => state.user.user)

    const dispatch = useDispatch()
    
    const {mutate: postCommentMutate} = useMutation({
        mutationFn: postComment,
        onSuccess: (data) => {
            data.comment.author = {
                _id: loggedUserInfo._id,
                username: loggedUserInfo.username,
                profilePicUrl: loggedUserInfo.profilePicUrl
            }
            if(type === "reviews" || type === "lists"){
                dispatch(commentsAction.addNewComment(data.comment)) 
            }
            if(type === "comments"){
                dispatch(commentsAction.addNewAnswer(data.comment))
            }
        }
    })

    function handleSubmitComment(event) {
        event.preventDefault()

        const formData = new FormData(event.target)
        const data = Object.fromEntries(formData)
        //esvazia o input de comentario
        commentTextAreaRef.current.value = ""

        if(data.comment.trim() !== ""){
            postCommentMutate({id: parent._id, type: type, comment: data.comment})
        }
    }
    
    function handleKeyDown(event){
        if(event.key === "Enter" && !event.shiftKey) {
            //comportamento padrão é quebrar a linha
            event.preventDefault()
            sendButtonRef.current.click()
        }
    }

    return <form onSubmit={handleSubmitComment}>
        <div className={classes["comment-div"]}>
            <textarea
                ref={commentTextAreaRef} 
                name="comment" 
                id="comment" 
                placeholder="Leave a comment..."
                onKeyDown={handleKeyDown}>
            </textarea>
            <button ref={sendButtonRef} type="submit" className={classes["comment-button"]}>
                <span className={`material-symbols-outlined ${classes["comment-icon"]}`}>
                    send
                </span>
            </button>
        </div>
    </form>
}