import classes from "./ListsPage.module.css"
import { useState } from "react"

import { Link, useParams } from "react-router-dom"

import PostList from "../../components/postList/PostList"
import { fetchUserInfo, fetchUserLists } from "../../services/users"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import LoadMoreSensor from "../../components/loadMoreObserver/LoadMoreObserver"
import { ITEMS_PER_PAGE } from "../../utils/constants"

export default function ListsPage(){
    const [sortBy, setSortBy] = useState({sortBy: 'createdAt', order: -1})
    const {id} = useParams()
    
    const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: [ "lists", "user", `${id}`, `${sortBy.sortBy}`, `${sortBy.order}`],
        queryFn: ({ signal, pageParam=1 }) => fetchUserLists(signal, id, sortBy, pageParam),
        getNextPageParam: (lastPage, allPages) => {
            return (lastPage.lists.length != ITEMS_PER_PAGE) ? undefined : allPages.length + 1
        }
    })

    const { data: userData } =  useQuery({
        queryKey: ["username", `${id}`],
        queryFn: ({signal}) => fetchUserInfo({signal, id, basicOnly: true})
    })

    let content
    if(isPending) {
        content = <>
            <LoaderDots />
        </>
    }
        
    if(isError) {
        content = <>
            <h2>Error while fetching this user lists. Please, try again later.</h2>
        </>
    }

    if(data) { 
        const lists = data.pages.map(page => page.lists).flat(1) 
        content = <PostList type="lists" posts={lists} />
    }

    return <div className={classes["general-container"]}>
        <div className={classes["header-section"]}>   
                <h1><Link className="inverted" to={`/profile/${id}`} >{userData?.user?.username ?? "user"}</Link>&apos;s lists</h1>
                <div className={classes["select-div"]} >
                    <label htmlFor="type"hidden>Sort by</label>
                    <select id="type" value={JSON.stringify(sortBy)} onChange={(e) => setSortBy(JSON.parse(e.target.value))} >
                        <option value={JSON.stringify({sortBy: 'createdAt', order: -1})}>Newest Posts</option>
                        <option value={JSON.stringify({sortBy: 'createdAt', order: 1})}>Earliest Posts</option>
                    </select>
                </div>
            </div>
        
        {content}

        {isFetchingNextPage && <LoaderDots/>}

        <LoadMoreSensor fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}/>

        {(!hasNextPage && data?.pages.length > 1) &&
            <h3 className={classes["no-more-lists-message"]}>It&apos;s a dead end! No more lists to load.</h3>
        }

    </div>
}