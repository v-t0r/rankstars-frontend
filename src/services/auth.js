import { redirect } from "react-router-dom"
import store from "../store"
import { userActions } from "../store"
import { backendUrl } from "../utils/constants"

export function getTokenRemainingTime(){
    const tokenExpiration = localStorage.getItem("tokenExpiration")
    return tokenExpiration - new Date().getTime()
}

export async function userContextLoader(){
    /*
        Esta função verifica se o usuário está logado, e estabelece um contexto com suas informações
    */

    try{
        const statusResponse = await fetch(`${backendUrl}/auth/status`)

        const status = await statusResponse.json()
        //usuario nao está logado
        if(!status.authenticated){
            store.dispatch(userActions.updateUserInfo({user: null}))
            return {} 
        }

        const userInfoResponse = await fetch(`${backendUrl}/users/${status.userId}`)
        if(!userInfoResponse.ok){
            const error = new Error("Could not fetch authenticated user info")
            error.status = userInfoResponse.status
            error.info = await userInfoResponse.json()
            throw error
        }

        const userInfo = await userInfoResponse.json()
        store.dispatch(userActions.updateUserInfo({user: userInfo.user}))
        store.dispatch(userActions.updateExpDate({expDate: status.expDate}))
        return {}

    }catch(error){
        if(!error.status){
            error.status = 500  
        }
        
        throw error
    }
     
}

export async function checkAuthentication(expect){
    const { user } = store.getState()
    
    if((user.user && expect) || (!user.user && !expect)){
        return null
    }
    
    return expect === true ? redirect("/login") : redirect("/")
}


