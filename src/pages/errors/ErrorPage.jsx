import classes from "./ErrorPage.module.css"

import { Link, useRouteError } from "react-router-dom"

export default function ErrorPage(){
    const error = useRouteError()

    console.log(error)

    let errorContent = <>
            <p>Looks like we are having trouble with our servers!</p>
            <p>Can you please try again later?</p>
        </>

    if(error.status === 404){
        errorContent = <>
            <p>Looks like you fall in the void!</p> 
            <p>Why not you <Link>click here</Link> and go back to the start?</p>
        </>
    }

    return <>
        <div className={classes["error-container"]}>
            <h1>:(</h1>
            <h2>Oops...</h2>
            {errorContent}
        </div>
    </>
    
}