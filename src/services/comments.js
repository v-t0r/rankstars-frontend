import { backendUrl } from "../utils/constants";

export async function fetchComments({id, type, answers = false, signal}){

    const response = await fetch((`${backendUrl}/${type}/${id}/comments${answers && "?answers=true"}`),{
        signal: signal,
        method: "GET"
    })

    if(!response.ok){
        const error = new Error("Cound not fetch comments.")
        error.status = response.status
        error.info = response.json()
        throw error
    }

    return await response.json()
}

export async function postComment({id, type, comment}) {

    const response = await fetch((`${backendUrl}/${type}/${id}/comments`),{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: comment
        })
    })

    if(!response.ok){
        const error = new Error("Error while posting comment.")
        error.status = response.status
        error.info = response.json()
        throw error
    }

    return await response.json()
}

export async function patchComment({id, form}) {
    try{
        const response = await fetch((`${backendUrl}/comments/${id}`),{
            method: "PATCH",
            credentials: "include",
            body: form
        })
    
        if(!response.ok){
            const error = new Error("Error while patching comment")
            error.status = response.status
            error.info = response.json()
            throw error
        }
    
        return await response.json()
    }catch(error){
        if(!error.status){
            error.status == 500
        }
        throw error
    }
}

export async function deleteComment({id}) {
    const response = await fetch((`${backendUrl}/comments/${id}`),{
        method: "DELETE",
        credentials: "include",
    })

    if(!response.ok){
        const error = new Error("Error while deleting comment")
        error.status = response.status
        error.info = response.json()
        throw error
    }

    return await response.json()
}