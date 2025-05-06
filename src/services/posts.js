import { backendUrl, ITEMS_PER_FEED_PAGE, ITEMS_PER_PAGE } from "../utils/constants";

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

export async function getPost({signal, postId, type, sortBy = "userOrder", order = null, page = null, summary=false}) {
    const queryParams = new URLSearchParams()

    if(type=="lists" && sortBy !== "userOrder"){
        queryParams.set("sortBy", sortBy)
        queryParams.set("order", order)
    }

    if(type === "lists" && page){
        queryParams.set("limit", ITEMS_PER_PAGE)
        queryParams.set("skip", ITEMS_PER_PAGE * (page-1))
    }

    if(type === "lists" && summary == true){
        queryParams.set("summary", true)
    }
    
    const response = await fetch(`${backendUrl}/${type}/${postId}?${queryParams.toString()}`, {
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

export async function getPosts( {signal, type, searchParams, page = 1} ){

    const queryParameters = new URLSearchParams(searchParams)
    queryParameters.set("limit", ITEMS_PER_FEED_PAGE)
    queryParameters.set("skip", ITEMS_PER_FEED_PAGE * (page-1))

    const response = await fetch(`${backendUrl}/${type}?${queryParameters.toString()}`,{
        signal: signal,
        method: "GET", 
        credentials: "include"
    })

    if(!response.ok){
        const error = new Error("Failed to retrive posts")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}

export async function getPostsCategories({signal, type, searchParams}) {
    
    const queryParameters = new URLSearchParams(searchParams)

    const response = await fetch(`${backendUrl}/${type}/categories/?${queryParameters.toString()}`,{
        signal: signal,
        method: "GET", 
        credentials: "include"
    })

    if(!response.ok){
        const error = new Error("Failed to retrive posts categories")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}
