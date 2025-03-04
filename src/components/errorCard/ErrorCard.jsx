import classes from "./ErrorCard.module.css"

export default function ErrorCard({title = "Server Side Error", message=null}){

    if(!message){
        message = "Looks like we got a little problem in our servers! Can you try again later, please?"
    }

    return <div className={classes["card"]}>
        <h1>{title}</h1>
        
        <div className={classes["message-div"]}>
            {message}
        </div>
    </div>
}