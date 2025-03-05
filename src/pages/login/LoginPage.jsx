import store, { userActions } from "../../store"
import { backendUrl } from "../../utils/constants"
import classes from "./LoginPage.module.css"
import { Form, Link, redirect, useActionData, useNavigation } from "react-router-dom"

export default function LoginPage(){

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
        credentials: "include",
        body: JSON.stringify({
            email: postData.email,
            password: postData.password
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    if(response.status === 401){
        errorResponse.errors.general = "Email or password incorrect! Please, try again!"
        return errorResponse
    }

    const {userId} = await response.json()

    const userInfoResponse = await fetch(`${backendUrl}/users/${userId}`)

    if(!userInfoResponse.ok){
        errorResponse.errors.general = "Our servers are down. Try again later!"
        return errorResponse 
    }

    const userInfo = await userInfoResponse.json()
    store.dispatch(userActions.updateUserInfo(userInfo))

    return redirect("/")
}
