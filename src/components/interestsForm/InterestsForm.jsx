import classes from "./InterestsForm.module.css"

import CategoriesList from "../categoriesList/CategoriesList"

export default function InterestsForm({user, onClose}){

    async function handleSubmit(e){
        e.preventDefault()
        const formData = new FormData(event.target)

        const checkedCategories = formData.getAll("category")

        console.log(checkedCategories)
        console.log("Submiting new categories")
        onClose()
    }

    return <form className={classes["form"]} onSubmit={handleSubmit}>
        <h2>We want to know more about you!</h2>
        <h3>Why not you select at least one interest?</h3>
        
        <CategoriesList user={user ?? null}/>
        
        <div className={classes["action-buttons"]}>
            <button type="button" className="negative-button" onClick={onClose} >{user ? "cancel" : "later"}</button>
            <button type="Submit" className="button secondary-button">Save</button>
        </div>
   
    </form>
}