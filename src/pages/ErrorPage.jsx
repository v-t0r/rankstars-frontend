import classes from "./ErrorPage.module.css"

import { Link } from "react-router-dom"

export default function ErrorRoute(){
    return <>
        <div className={classes["error-container"]}>
            <h1>:(</h1>
            <h2>Ops...</h2>
            <p>Looks like something went wrong!</p> 
            <p><Link>Click here</Link> to go back to the start.</p>
        </div>
    </>
    
}