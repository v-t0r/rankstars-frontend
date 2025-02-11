import { getAuthToken } from "../auth";
import { backendUrl } from "../http";

export async function fetchReviewInfo({signal, reviewId}) {
    const token = getAuthToken()

    const response = await fetch(`${backendUrl}/reviews/${reviewId}`, {
        signal: signal,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) {
        const error = new Error("Error while fetching the post")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const review = await response.json()
    return review
}

export async function getPost({signal, postId, type}) {
    const token = getAuthToken()

    const response = await fetch(`${backendUrl}/${type}/${postId}`, {
        signal: signal,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) {
        const error = new Error("Error while fetching the post")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const post = await response.json()
    return post
}

export async function postReview(reviewData) {
    const token = getAuthToken()

    const response = await fetch(`${backendUrl}/reviews`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: reviewData
    })

    if(!response.ok) {
        const error = new Error("Error while creating the review")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const { review } = await response.json()
    return review 
}

export async function patchPost({id, data, type}) {
    const token = getAuthToken()

    const response = await fetch(`${backendUrl}/${type}/${id}`,{
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: data
    })

    if(!response.ok){
        const error = new Error("Error while pacthing the post!")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}

export async function deletePost({id, type}){
    const token = getAuthToken()
    
    const response = await fetch(`${backendUrl}/${type}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok){
        const error = new Error("Error while deleting post")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}

export async function likeReview({reviewId, operation}){
    const token = getAuthToken()

    const response = await fetch(`${backendUrl}/reviews/${reviewId}/likes`, {
        method: operation == "like" ? "POST" : "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok){
        const error = new Error("Error while (des)liking review.")
        error.status = response.status
        error.info = await response.json()
        throw error 
    }

    return await response.json()
}

