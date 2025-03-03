import { backendUrl } from "../utils/constants";

export async function fetchUserInfo({signal, id}) {

    const response = await fetch(`${backendUrl}/users/${id}`, {signal: signal})

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

export async function fetchUserReviews(signal, userId, sortBy = {sortBy: 'createdAt', order: -1}) {

    const response = await fetch(`${backendUrl}/users/${userId}/reviews?sortBy=${sortBy.sortBy}&order=${sortBy.order}`, {
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

export async function fetchUserLists(signal, userId, sortBy = {sortBy: 'createdAt', order: -1}) {

    const response = await fetch (`${backendUrl}/users/${userId}/lists?sortBy=${sortBy.sortBy}&order=${sortBy.order}`, {
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

