import { createUserContext } from "../../services/auth"
import { backendUrl } from "../../utils/constants"
import classes from "./LoginForm.module.css"
import { useEffect, useState } from "react"

import InterestsForm from "../interestsForm/InterestsForm"
import { useSelector } from "react-redux"

export default function LoginForm({onClose, onSignup}){
    const [validationErrors, setValidationErrors] = useState([])
    const [showInterestsForm, setShowInterestsForm] = useState(false)

    const userInfo = useSelector(state => state.user)

    useEffect(() => {
        if(userInfo.user && userInfo.user.interests.length > 0){
            onClose()
        }
        
        if(userInfo.user && userInfo.user.interests.length === 0){
            setShowInterestsForm(true)
        }

    }, [userInfo, onClose])




    async function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        let errors = []

        if(!String(data.email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
            errors = [...errors, ["email", "Please enter a valid email!"]]
        }

        if(data.password.length < 3){ //adicionar requisitos mais complexos posteriormente
            errors = [...errors, ["password", "Password must be at least 3 characters."]]
        }

        if(errors.length > 0){
            setValidationErrors(errors)
            return
        }

        const response = await fetch(`${backendUrl}/users/login`, {
            method: "POST",
            credentials: "include",
            body: formData
        })

        if(response.status === 401){
            errors = [...errors, ["general", "Email or password incorrect! Please, try again!"]]
            setValidationErrors(errors)
            return
        }
        
        const { expDate } = await response.json()
        await createUserContext(expDate)
    }

    return <>
        {!showInterestsForm && <div className={classes["container"]}> 
            <div className={classes["header"]}>
                <h1>Login</h1>
                <button className="negative-button" onClick={onClose}>X</button>
            </div>
            
            <form className={classes["form"]} onSubmit={handleSubmit}>
                <div className={classes["label-input"]}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email"></input>
                    {validationErrors.map((error, index) => error[0] === "email" && <p key={index} className="error-text">{error[1]}</p>)}
                </div>

                <div className={classes["label-input"]}>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password"/>
                    {validationErrors.map((error, index) => error[0] === "password" && <p key={index} className="error-text">{error[1]}</p>)}
                </div>
                {validationErrors.map((error, index) => error[0] === "general" && <p key={index} className="error-text">{error[1]}</p>)}
                <div className={classes["button-link"]}>
                    <button className="button" type="submit" disabled={navigation.state === "submitting"}>Login</button>
                    <button className="text-button" type="button" onClick={onSignup}>or signup</button>
                </div>
            </form>
        </div>}

        {
            showInterestsForm && <InterestsForm user={userInfo.user} onClose={onClose} />
        }

    </>
}