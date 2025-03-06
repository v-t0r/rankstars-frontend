// import { redirect } from "react-router-dom"
import store, { userActions } from "../store"
import { backendUrl } from "../utils/constants"

export async function createUserContext(expDate){
    try{
        const response = await fetch(`${backendUrl}/users/myuser`)

        if(!response.ok){
            const error = new Error("There is no authenticated user.")
            error.status = response.status
            error.info = await response.json()
            return 
        }

        const userInfo = await response.json()
        store.dispatch(userActions.createUserContext({user: userInfo.user, expDate: expDate}))

    }catch(error){
        if(!error.status){
            error.status = 500
        }
        throw error
    }
}

export async function authenticationLoader(){
    try{
        const response = await fetch(`${backendUrl}/auth/status`)
        const status = await response.json()

        if(!status.authenticated){
            return null
        }

        createUserContext(status.expDate)
        return null
    }catch(error){
        error.status = 500
        throw error
    }

}

export async function logout(){
    
    try{
        const response = await fetch(`${backendUrl}/logout`, {
            credentials: "include"
        })

        if(!response.ok){
            const error = new Error("Something went wrong. Please, try again later.")
            error.status = response.status
            error.info = await response.json()
            throw error
        }

        store.dispatch(userActions.createUserContext({user: null, expDate: null}))

    }catch(error){
        if(!error.status){
            error.status = 500
        }
        
        throw error
    }
}
























//ANTIGA AUTENTICAÇÃO

// export async function userContextLoader(){
//     /*
//         Esta função verifica se o usuário está logado, e estabelece um contexto com suas informações
//     */

//     try{
//         const statusResponse = await fetch(`${backendUrl}/auth/status`)

//         const status = await statusResponse.json()
//         //usuario nao está logado
//         if(!status.authenticated){
//             store.dispatch(userActions.updateUserInfo({user: null}))
//             return {} 
//         }

//         const userInfoResponse = await fetch(`${backendUrl}/users/${status.userId}`)
//         if(!userInfoResponse.ok){
//             const error = new Error("Could not fetch authenticated user info")
//             error.status = userInfoResponse.status
//             error.info = await userInfoResponse.json()
//             throw error
//         }

//         const userInfo = await userInfoResponse.json()
//         store.dispatch(userActions.updateUserInfo({user: userInfo.user}))
//         store.dispatch(userActions.updateExpDate({expDate: status.expDate}))
//         return {}

//     }catch(error){
//         if(!error.status){
//             error.status = 500  
//         }
        
//         throw error
//     }
     
// }

// export async function checkAuthentication(expect){
//     const { user } = store.getState()
    
//     if((user.user && expect) || (!user.user && !expect)){
//         console.log("Não falhou!")
//         return null
//     }
    
//     console.log("Falhou!")
//     return expect === true ? redirect("/login") : redirect("/")
// }


