import { backendUrl } from "../../utils/constants"
import { isStrongPassword } from "../../utils/functions"
import classes from "./LoginForm.module.css"
import { useState } from "react"

export default function SignupForm({onClose, onLogin}){
    const [validationErrors, setValidationErrors] = useState([])

    async function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        let errors = []

        if(data.username.trim() === ""){
            errors = [...errors, ["username", "Username can't be empty!"]]
        }

        if(!String(data.email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
            errors = [...errors, ["email", "Please enter a valid email!"]]
        }

        const {isStrong, errors: passwordErrors} = isStrongPassword(data.password)
        if(!isStrong){
            passwordErrors.forEach((error) => {
                errors = [...errors, ["password", error]]
            })
        }

        if(data.password.trim() != data["confirm-password"].trim() || data["confirm-password"] === ""){ //senhas devem coincidir
            errors = [...errors, ["confirm-password", "Passwords does not match!"]]
        }

        if(errors.length > 0){
            setValidationErrors(errors)
            return
        }

        try{
            const response = await fetch(`${backendUrl}/users/`, {
                method: "POST",
                body: formData,
                credentials: "include"
            })

            if(response.status === 422){
                const errorInfo = await response.json()
                errors = [...errors, ["general", ...errorInfo.data.map(error => error.msg)]]
                setValidationErrors(errors)
                return
            }

            if(response.ok){
                onLogin()
            }

        }catch(error){
            error.status = 500
            throw error
        }
    }

    return <div className={classes["container"]}> 
        <>
            <div className={classes["header"]}>
                <h1>Signup</h1>
                <button className="negative-button" onClick={onClose}>X</button>
            </div>
        
            <form className={classes["form"]} onSubmit={handleSubmit}>

                <div className={classes["label-input"]}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username"></input>
                    {validationErrors.map((error, index) => error[0] === "username" && <p key={index} className="error-text">{error[1]}</p>)}
                </div>

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

                <div className={classes["label-input"]}>
                    <label htmlFor="confirm-password">Confirm password</label>
                    <input type="password" name="confirm-password" id="confirm-password"/>
                    {validationErrors.map((error, index) => error[0] === "confirm-password" && <p key={index} className="error-text">{error[1]}</p>)}
                </div>
                {validationErrors.map((error, index) => error[0] === "general" && <p key={index} className="error-text">{error[1]}</p>)}
                <div className={classes["button-link"]}>
                    <button className="button" type="submit" disabled={navigation.state === "submitting"}>Signup</button>
                    <button className="text-button" type="button" onClick={onLogin}>or login</button>
                </div>

            </form>
        </>
        
    </div>
}