import { getAuthToken } from "./auth";
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
    const token = getAuthToken()
    const response = await fetch((`${backendUrl}/${type}/${id}/comments`),{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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

export async function deleteComment({id}) {
    const token = getAuthToken()

    const response = await fetch((`${backendUrl}/comments/${id}`),{
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok){
        const error = new Error("Error while deleting comment")
        error.status = response.status
        error.info = response.json()
        throw error
    }

    return await response.json()
}