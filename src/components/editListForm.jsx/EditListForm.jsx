import { useState } from "react"
import classes from "./EditListForm.module.css"

import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

import DndListItem from "../dndList/dndListItem/DndListItem"
import { useMutation } from "@tanstack/react-query"
import { patchPost } from "../../services/posts"
import { queryClient } from "../../services/queryClient"

export default function EditListForm({list, onClose}){
    const  [listForm, setListForm] = useState({
        title: list.title,
        description: list.description,
        reviews: list.reviews
    })

    const {mutate: patchListMutate} = useMutation({
        mutationFn: patchPost,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["list", `${list._id}`]})
            onClose()
        }
    })

    function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData()
        formData.append("title", listForm.title)
        formData.append("description", listForm.description)
        
        listForm.reviews.forEach(review => {
            formData.append("reviews", review._id)
        })

        patchListMutate({id: list._id, data: formData, type: "lists"})
    }

    function getReviewPosition(id){
        return listForm.reviews.findIndex(review => review._id === id)
    }

    function handleDragEnd(event){
        const {active, over} = event

        //nao mudou o lugar
        if(active.id === over.id){
            return
        }

        setListForm(prevState => {
            const originalPos = getReviewPosition(active.id)
            const newPos = getReviewPosition(over.id)

            const newReviewsList =  arrayMove(prevState.reviews, originalPos, newPos)
            
            return {...prevState, reviews: newReviewsList}
        })
    }

    function handleRemoveReview(id){
        setListForm(prevState => {
            const newReviewList = prevState.reviews.filter(review => review._id !== id)
        
            return {...prevState, reviews: newReviewList}
        })
    }

    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))

    return <>
        <form className={classes["form-div"]} onSubmit={handleSubmit}>
            <div className={classes["header-div"]}>
                <h1>Edit List</h1>
                <button className="negative-button" onClick={onClose}>X</button>
            </div>
            <div className={classes["label-input-div"]}>
                <label htmlFor="title">Title</label>
                <input id="title" value={listForm.title}  onChange={(e) => setListForm(prevState => ({...prevState, title: e.target.value}))} />
            </div>

            <div className={classes["label-input-div"]}>
                <label htmlFor="">Description</label>
                <input id="description" value={listForm.description} onChange={(e) => setListForm(prevState => ({...prevState, description: e.target.value}))} />
            </div>
            
            <div className={classes["label-input-div"]}>
                <label>Reviews</label>
                <div className={classes["reviews-div"]}>
                    <DndContext 
                        sensors={sensors} 
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={listForm.reviews.map(review => review._id)}>

                            {listForm.reviews.map(review => {
                                return <DndListItem key={review._id} review={review} onRemove={() => handleRemoveReview(review._id)}/>
                            })}

                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        
            <div className={classes["action-buttons-div"]}>
                <button type="button" className="negative-button" onClick={onClose}>cancel</button>
                <button type="submit" className="secondary-button button">Save</button>
            </div>
        </form>

    </>

}