import { backendUrl } from "../utils/constants"
import classes from "./Login.module.css"
import { Form, Link, redirect, useActionData, useNavigation } from "react-router-dom"
// import store, { userActions } from "../store"

export default function LoginRoute(){

    const data = useActionData()
    const navigation = useNavigation()

    return <div className={classes["main-container"]}>
        <h1>Login</h1>
        <Form method="post" className={classes["form"]}>

            <div className={classes["label-input"]}>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" id="email"/>
                {data?.errors?.email && <p className="error-text">{data.errors.email}</p>}
            </div>

            <div className={classes["label-input"]}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                {data?.errors?.password && <p className="error-text">{data.errors.password}</p>}
            </div>            
            {data?.errors?.general && <p className="error-text">{data.errors.general}</p>}
            <div className={classes["button-link"]}>
                <button className="button" type="submit" disabled={navigation.state === "submitting"}>Login</button>
                <p><Link to="/signup">Create a new account!</Link></p>
            </div>
        
        </Form>
    </div>
}

export async function action({ request }) {
    const formData =  await request.formData() //recupera o formulario submetido
    const postData = Object.fromEntries(formData) //converte o formData para um objeto normal

    let errorResponse = {errors: {}}

    //validation of the inputs
    if(!String(postData.email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
        errorResponse.errors.email = "Please enter a valid email!"
    }

    if(postData.password.length < 3){ //adicionar requisitos mais complexos posteriormente
        errorResponse.errors.password = "Password must be at least 3 characters."
    }

    if(Object.keys(errorResponse.errors).length > 0){
        return errorResponse
    }

    const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        body: JSON.stringify({
            email: postData.email,
            password: postData.password
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    const responseJson = await response.json()

    if(response.status === 401){
        errorResponse.errors.general = "Email or password incorrect! Please, try again!"
        return errorResponse   
    }

    //const expirationTime = new Date().getTime() + (1000 * 60 * 60)
    const expirationTime = new Date().getTime() + (1000 * 60 * 60)
    localStorage.setItem("token", responseJson.token)
    localStorage.setItem("tokenExpiration", expirationTime.toString())
    localStorage.setItem("userId", responseJson.userId)

    return redirect("/")
}
