import classes from "./LoaderDots.module.css"

export default function LoaderDots(){
    return <div className={classes["loader-container"]}>
        <div className={classes["dot"]} id={classes["dot-1"]}></div>
        <div className={classes["dot"]}  id={classes["dot-2"]}></div>
        <div className={classes["dot"]}  id={classes["dot-3"]}></div>
    </div>
        
}