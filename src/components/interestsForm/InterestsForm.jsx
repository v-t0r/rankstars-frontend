import classes from "./InterestsForm.module.css"

import CategoriesList from "../categoriesList/CategoriesList"
import { useMutation } from "@tanstack/react-query"
import { patchUser } from "../../services/users"
import { queryClient } from "../../services/queryClient"
import { useState } from "react"

export default function InterestsForm({user, onClose}){

    const [validationErrors, setValidationErrors] = useState([])

    const { mutate } = useMutation({
        mutationFn: patchUser,
        onSuccess: () => {
            queryClient.invalidateQueries
            onClose()
        }
    })
 
    async function handleSubmit(e){
        e.preventDefault()
        const formData = new FormData(event.target)

        const checkedCategories = formData.getAll("interests")

        if(checkedCategories.length === 0){
            setValidationErrors(prev => [...prev, "You must select at least one category!"])
            return
        }

        mutate(formData)
    }

    return <form className={classes["form"]} onSubmit={handleSubmit}>
        <h2>We want to know more about you!</h2>
        <h3>Why not you select at least one interest?</h3>
        
        <CategoriesList user={user ?? null}/>
        
        {validationErrors.map((error, index) => <p key={index} className="error-text">{error}</p>)}

        <div className={classes["action-buttons"]}>
            <button type="button" className="negative-button" onClick={onClose} >{user ? "cancel" : "later"}</button>
            <button type="Submit" className="button secondary-button">Save</button>
        </div>
   
    </form>
}