import classes from "./Grabber.module.css"

export default function Grabber({attributes, listeners}){

    return <div className={classes["grabber"]} {...attributes} {...listeners}>

        <div className={classes["column"]}>
            <div className={classes["dot"]}></div>
            <div className={classes["dot"]}></div>
            <div className={classes["dot"]}></div>
        </div>

        <div className={classes["column"]}>
            <div className={classes["dot"]}></div>
            <div className={classes["dot"]}></div>
            <div className={classes["dot"]}></div>
        </div>

    </div>

}