import { useMutation } from "@tanstack/react-query"
import classes from "./NewListForm.module.css"
import { createList, addReviewToList } from "../../services/posts"
import { useState } from "react"
import { queryClient } from "../../services/queryClient"

export default function NewListForm({onClose, onCancel, review=null}){

    const [validationErrors, setValidationErrors] = useState([])

    const { mutate: newListMutate, isPending, isSuccess } = useMutation({
        mutationFn: createList,
        onSuccess: (data) => {
            if(review){
                addReviewMutate({reviewId: review._id, listId: data.list._id})
            }else{
                queryClient.invalidateQueries()
                onClose()
            }
        }
    })

    const { mutate: addReviewMutate} = useMutation({
        mutationFn: addReviewToList,
        onSuccess: onClose
    })

    const isSubmitted = isPending || isSuccess

    function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData(e.target)
        
        const data = Object.fromEntries(formData)
        let errors = []
        
        if(data.title.trim().length === 0){
            errors = [...errors, ["title", "Title can't be empty!"]]
        }
        
        if(errors.length !== 0){
            setValidationErrors(errors)
            return 
        }
        
        newListMutate(formData)
    }

    return <form className={classes["new-list-form"]} onSubmit={handleSubmit}>
        <div className={classes["header-div"]}>
            <h1>Create New List</h1>
            <button type="button" className="negative-button" onClick={onClose}>X</button>
        </div>
        <div className={classes["inputs-div"]}>
            <div className={classes["label-input"]}>
                <label htmlFor="title" >Title</label>
                <input name="title" id="title" placeholder="(you must choose a title)" />
                {validationErrors.map((error, index) => error[0] === "title" && <p className="error-text" key={index}>{error[1]}</p>)}
            </div>

            <div className={classes["label-input"]}>
                <label htmlFor="description">Description</label>
                <input name="description" id="description" placeholder="(this is optional)"/>
            </div>
        </div>
        

        <div className={classes["action-buttons-div"]}>
            <button type="button" className={review ? "text-button" : "negative-button"} onClick={onCancel}>{review ? "back" : "cancel"}</button>
            <button type="submit" className="button secondary-button" disabled={isSubmitted} >{isSubmitted ? "Creating" : "Create"}</button>
        </div>

    </form>
}