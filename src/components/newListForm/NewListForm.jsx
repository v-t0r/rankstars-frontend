import { useMutation } from "@tanstack/react-query"
import classes from "./NewListForm.module.css"
import { createList, addReviewToList } from "../../services/posts"

export default function NewListForm({review, onClose, onCancel}){

    const { mutate: newListMutate } = useMutation({
        mutationFn: createList,
        onSuccess: (data) => addReviewMutate({reviewId: review._id, listId: data.list._id})
    })

    const { mutate: addReviewMutate } = useMutation({
        mutationFn: addReviewToList,
        onSuccess: onClose
    })

    function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData(e.target)
        newListMutate(formData)
    }

    return <form className={classes["new-list-form"]} onSubmit={handleSubmit}>
        <div className={classes["header-div"]}>
            <h1>Create New List</h1>
            <button type="button" className="negative-button" onClick={onClose}>X</button>
        </div>
        <div className={classes["inputs-div"]}>
            <div className={classes["label-input"]}>
                <label htmlFor="title" hidden>Title</label>
                <input name="title" id="title" placeholder="Title" />
            </div>

            <div className={classes["label-input"]}>
                <label htmlFor="description" hidden>Description</label>
                <input name="description" id="description" placeholder="Description"/>
            </div>
        </div>
        

        <div className={classes["action-buttons-div"]}>
            <button type="button" className="text-button" onClick={onCancel}>back</button>
            <button type="submit" className="button secondary-button">Create</button>
        </div>

    </form>
}