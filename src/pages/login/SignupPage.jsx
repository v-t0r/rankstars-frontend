import { backendUrl } from "../../utils/constants"
import classes from "./LoginPage.module.css"
import { Form, Link, redirect, useActionData, useNavigation } from "react-router-dom"

export default function LoginRoute(){

    const data = useActionData() //para obter o retorno do action
    const navigation  = useNavigation() //para obter o estado do action 

    return <div className={classes["main-container"]}>
        <h1>Signup</h1>
        <Form method="post" className={classes["form"]}>
            <div className={classes["label-input"]}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                {data?.errors?.username && <p className="error-text">{data.errors.username}</p>}
            </div>

            <div className={classes["label-input"]}>
                <label htmlFor="text">Email</label>
                <input type="email" name="email" id="email"/>
                {data?.errors?.email && <p className="error-text">{data.errors.email}</p>}
            </div>

            <div className={classes["label-input"]}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                {data?.errors?.password && <p className="error-text">{data.errors.password}</p>}
            </div>
        
            <div className={classes["label-input"]}>
                <label htmlFor="confirm-password">Confirm password</label>
                <input type="password" name="confirm-password" id="confirm-password" />
                {data?.errors?.confirmPassword && <p className="error-text">{data.errors.confirmPassword}</p>}
            </div>

            {data?.errors?.general && <p className="error-text">{data.errors.general}</p>}
            <div className={classes["button-link"]}>
                <button className="button" type="submit" disabled={navigation.state == "submitting"}>Sign up</button>
                <p>Already have a account? <Link to="/login">Click here</Link> to login!</p>
            </div>
        </Form>
    </div>
}

export async function action({ request }) {
    const formData =  await request.formData() //recupera o formulario submetido
    const postData = Object.fromEntries(formData) //converte o formData para um objeto normal

    let errorResponse = {errors: {}}

    //validation of the inputs
    if(!String(postData.email).trim().toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
        errorResponse.errors.email = "Please enter a valid email!"
    }

    if(postData.password.length < 3){ //adicionar requisitos mais complexos posteriormente
        errorResponse.errors.password = "Password must be at least 3 characters."
    }

    if(postData.password.trim() != postData["confirm-password"].trim() || postData["confirm-password"] ==+ ""){ //senhas devem coincidir
        errorResponse.errors.confirmPassword = "Passwords does not match!"
    }
    if(postData.username.trim() === ""){ //senhas devem coincidir
        errorResponse.errors.username = "Usernames can't be empty!"
    }
    if(Object.keys(errorResponse.errors).length > 0){
        return errorResponse
    }

    const response = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        body: JSON.stringify({
            username: postData.username,
            email: postData.email,
            password: postData.password,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status === 422){
        const responseJson = await response.json()
        return {errors: {general: responseJson.data[0].msg} }
    }

    if(response.status === 500){
        return {errors: {general: "Server side problem. Please, try again later!"} }
    }

    return redirect("/login")
}

    

    
   