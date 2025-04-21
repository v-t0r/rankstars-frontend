import { backendUrl, ITEMS_PER_FEED_PAGE } from "../utils/constants";

export async function fetchFeed({signal, feedType, olderThan = Date.now()}) {
    
    const response = await fetch(`${backendUrl}/feed/${feedType}?limit=${ITEMS_PER_FEED_PAGE}&olderThan=${olderThan}`, {
        signal: signal,
        method: "GET",
        credentials: "include",
    })

    if(!response.ok) {
        const error = new Error("Error while fetching the posts")
        error.status = response.status
        error.info = await response.json()
        throw error
    }

    const posts = await response.json()
    
    return posts
}