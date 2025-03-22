import { useState } from "react";
import classes from "./EditCommentForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { patchComment } from "../../../services/comments";
import { useDispatch } from "react-redux";
import { commentsAction } from "../../../store";

export default function EditCommentForm({comment, onCancel}){
    const [commentState, setCommentState] = useState({content: comment.content})
    const [validationErrors, setValidationErrors] = useState([])

    const dispatch = useDispatch()

    const {mutate: editMutate} = useMutation({
        mutationFn: patchComment,
        onSuccess: () => {
            dispatch(commentsAction.editComment({comment: comment, newContent: commentState.content}))
            onCancel()
        }
    })

    function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)

        let errors = []
        if(data.content.trim() === ""){
            errors = [...errors, ["content", "The comment can't be empty!"]]
        }

        if(errors.length > 0){
            setValidationErrors(errors)
            return
        }

        editMutate({id: comment._id, form: formData})
    }

    return <form className={classes["form"]} onSubmit={handleSubmit}>
        <h2>Editing comment</h2>
        
        <textarea name="content" value={commentState.content} onChange={e => setCommentState({content: e.target.value})}/>
        {validationErrors.map((error, index) => error[0] === "content" && <p key={index} className="error-text">{error[1]}</p>)}

        <div className={classes["action-buttons"]}>
            <button type="button" className="negative-button" onClick={onCancel}>discard</button>
            <button type="submit" className="button secondary-button">update</button>
        </div> 
    </form>
}