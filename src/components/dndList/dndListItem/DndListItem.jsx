import classes from "./DndListItem.module.css"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import Grabber from "../grabber/Grabber"

export default function DndListItem({review, onRemove}){

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: review._id})

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    return <div ref={setNodeRef} style={style} className={classes["item-card"]}>
        <div className={classes["grabber-and-info"]}>
            <Grabber attributes={attributes} listeners={listeners} />
            <div className={classes["review-info"]}>
                <p>{review.title}</p>
                <p style={{color: "var(--light-gray)", fontSize: "0.9rem"}}>author: {review.author.username} - rating: {review.rating}</p>
                
            </div>
        </div>
        <div className={classes["remove-button-div"]}>
            <button className="negative-button" onClick={onRemove}>X</button>
        </div>
        
    </div>
}