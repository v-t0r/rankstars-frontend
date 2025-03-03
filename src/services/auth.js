import store from "../store"
import { userActions } from "../store"
import { backendUrl } from "../utils/constants"

export function getTokenRemainingTime(){
    const tokenExpiration = localStorage.getItem("tokenExpiration")
    
    return tokenExpiration - new Date().getTime()
}

export function getUserId() {
    const userId = localStorage.getItem("userId")    
    return userId
}

export async function checkAuthLoader(){
    /*
        Esta função verifica se o usuário está logado, e estabelece um contexto com suas informações
    */

    try{
        const response = await fetch(`${backendUrl}/users/myuser`, {
            method: "GET",
            credentials: "include",
        })

        if(!response.ok){
            const error = new Error("Could not fetch the user info. Try again later")
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
