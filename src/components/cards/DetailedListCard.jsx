import classes from "./DetailedListCard.module.css"

export default function DetailedListCard({list}){
    
    return <div className={classes["card"]}>
            <p>{list._id}</p>
        </div>
}