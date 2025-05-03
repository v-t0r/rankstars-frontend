import { backendUrl, ITEMS_PER_FEED_PAGE, ITEMS_PER_PAGE } from "../utils/constants";

export async function fetchUserInfo({signal, id, basicOnly = false}) {

    let query = basicOnly ? "?basicOnly=true" : ""

    const response = await fetch(`${backendUrl}/users/${id}${query}`, {signal: signal})

    if(!response.ok){
        const error = new Error("Could not fetch the user info.")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const userInfo = await response.json()
    return userInfo
}

export async function followUser(userId) {

    const response = await fetch(`${backendUrl}/users/${userId}/followers`, {
        method: "POST",
        credentials: "include",
    })

    if(!response.ok) {
        const error = new Error("Error while following user.")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}

export async function unfollowUser(userId) {

    const response = await fetch(`${backendUrl}/users/${userId}/followers`, {
        method: "DELETE",
        credentials: "include",
    })

    if(!response.ok) {
        const error = new Error("Error while unfollowing user.")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}

export async function fetchUserReviews({signal, userId, searchParams, page = 1}) {

    const queryParameters = new URLSearchParams(searchParams)
    queryParameters.set("limit", ITEMS_PER_PAGE)
    queryParameters.set("skip", ITEMS_PER_PAGE*(page-1))

    const response = await fetch(`${backendUrl}/users/${userId}/reviews?${queryParameters}`, {
        signal: signal,
        method: "GET",
        credentials: "include",
    })

    if(!response.ok) {
        const error = new Error("Error while fetching user reviews.")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const reviews = await response.json()
    return reviews
}

export async function fetchUserLists({signal, userId, searchParams, page = 1}) {

    const queryParameters = new URLSearchParams(searchParams)
    queryParameters.set("limit", ITEMS_PER_PAGE)
    queryParameters.set("skip", ITEMS_PER_PAGE*(page-1))

    const response = await fetch (`${backendUrl}/users/${userId}/lists?${queryParameters}`, {
        signal: signal,
        method: "GET",
        credentials: "include",
    })

    if(!response.ok){
        const error = new Error("Error while fetching user lists.")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const lists = await response.json()
    return lists
}

export async function patchUser(form){
    const response = await fetch(`${backendUrl}/users`, {
        method: "PATCH",
        credentials: "include",
        body: form
    })

    if(!response.ok){
        const error = new Error("Error while patching the user.")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const patchedUser = await response.json()
    return patchedUser
}

export async function getUsers({signal, searchParams, page = 1}){

    const queryParameters = new URLSearchParams(searchParams)
    queryParameters.set("limit", ITEMS_PER_FEED_PAGE)
    queryParameters.set("skip", ITEMS_PER_FEED_PAGE * (page-1))
    if(queryParameters.get("category")){
        queryParameters.set("interests", queryParameters.get("category"))
        queryParameters.delete("category")
    }  

    const response = await fetch(`${backendUrl}/users?${queryParameters.toString()}`,{
        signal: signal,
        method: "GET", 
        credentials: "include"
    })

    if(!response.ok){
        const error = new Error("Failed to retrive users")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}

export async function getUsersInterests({signal, searchParams}) {

    const queryParameters = new URLSearchParams(searchParams)

    const response = await fetch(`${backendUrl}/users/interests/?${queryParameters.toString()}`,{
        signal: signal,
        method: "GET", 
        credentials: "include"
    })

    if(!response.ok){
        const error = new Error("Failed to retrive posts interests")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    return await response.json()
}
