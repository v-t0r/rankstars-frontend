import { backendUrl, ITEMS_PER_PAGE } from "../utils/constants";

export async function fetchReviewInfo({signal, reviewId}) {

    const response = await fetch(`${backendUrl}/reviews/${reviewId}`, {
        signal: signal,
        method: "GET",
        credentials: "include",
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

export async function getPost({signal, postId, type, sortBy = {sortBy: "userOrder", order: null}, page = null}) {

    sortBy.sortBy = sortBy.sortBy || "userOrder"
    sortBy.order = sortBy.order || 1

    let sortQuery = ""
    if(type === "lists" && sortBy.sortBy !=="userOrder"){
        sortQuery = `?sortBy=${sortBy.sortBy}&order=${sortBy.order}`
    }

    let pageQuery = ""
    if(page){
        pageQuery = sortBy.sortBy !== "userOrder" ? "&" : "?"
        pageQuery = pageQuery + `quantity=${ITEMS_PER_PAGE}&offset=${ITEMS_PER_PAGE*(page-1)}`
    }
    
    const response = await fetch(`${backendUrl}/${type}/${postId}${sortQuery}${pageQuery}`, {
        signal: signal,
        method: "GET",
        credentials: "include",
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

    const response = await fetch(`${backendUrl}/reviews`, {
        method: "POST",
        credentials: "include",
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

    const response = await fetch(`${backendUrl}/${type}/${id}`,{
        method: "PATCH",
        credentials: "include",
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
    
    const response = await fetch(`${backendUrl}/${type}/${id}`, {
        method: "DELETE",
        credentials: "include",
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

    const response = await fetch(`${backendUrl}/reviews/${reviewId}/likes`, {
        method: operation == "like" ? "POST" : "DELETE",
        credentials: "include",
    })

    if(!response.ok){
        const error = new Error("Error while (des)liking review.")
        error.status = response.status
        error.info = await response.json()
        throw error 
    }

    return await response.json()
}


export async function createList(listData){
    
    const response = await fetch(`${backendUrl}/lists`, {
        method: "POST",
        credentials: "include",
        body: listData
    })

    if(!response.ok){
        const error = new Error("Fail to create a new list.")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return response.json()
}


export async function addReviewToList({reviewId, listId}){
    addOrRemoverReviewFromList({reviewId, listId, operation: "add"})
}

export async function removeReviewFromList({reviewId, listId}){
    addOrRemoverReviewFromList({reviewId, listId, operation: "remove"})
}

async function addOrRemoverReviewFromList({reviewId, listId, operation}){
    const method = operation === "add" ? "POST" : "DELETE"

    const response = await fetch(`${backendUrl}/lists/${listId}/reviews/${reviewId}`, {
        method: method,
        credentials: "include",
    })

    if(!response.ok){
        const error = new Error("Failed to manipulate review on list")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}

