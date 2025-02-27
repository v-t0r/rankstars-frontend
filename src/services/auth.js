import { redirect } from "react-router-dom"
import store from "../store"
import { userActions } from "../store"
import { backendUrl } from "../utils/constants"

export function getTokenRemainingTime(){
    const tokenExpiration = localStorage.getItem("tokenExpiration")
    
    return tokenExpiration - new Date().getTime()
}

export function getAuthToken() {
    const token = localStorage.getItem("token")
    const remainingTime = getTokenRemainingTime()

    if(token && remainingTime < 0){
        return "EXPIRED"
    }
    
    return token
}

export function getUserId() {
    const userId = localStorage.getItem("userId")    
    return userId
}

export function tokenLoader(){
    return getAuthToken()
}

export async function checkAuthLoader(){
    /*
        Esta função verifica se o usuário está logado, e estabelece um contexto com suas informações
    */
    const token = getAuthToken()
    if(!token) {
        return redirect("/login")
    }

    const userId = getUserId()

    try{

        const response = await fetch(`${backendUrl}/users/${userId}`)

        if(!response.ok){
            const error = new Error("Could not fetch the user info.")
            error.status = response.status
            error.info = await response.json()
            throw error
        }

        const userInfo = await response.json()
        store.dispatch(userActions.updateUserInfo(userInfo))
        return null

    }catch(error){
        if(!error.status){
            error.status = 500
        }
        throw error
    }

    
}

export function checkNotAuthLoader(){ //you can only access the login/signup page if you are not logged
    const token = getAuthToken()
    if(token) {
        return redirect("/")
    }
    return null
}