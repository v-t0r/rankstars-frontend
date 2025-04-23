import { useSearchParams } from "react-router-dom"

import classes from "./SearchPage.module.css"
import { useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getPosts } from "../../services/posts"

import PostList from "../../components/postList/PostList"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import ErrorCard from "../../components/errorCard/ErrorCard"
import { getUsers } from "../../services/users"
import TabButton from "../../components/tabButton/TabButton"
import FiltersForm from "../../components/filtersForm/FiltersForm"
import LoadMoreObserver from "../../components/loadMoreObserver/LoadMoreObserver"

export default function SearchPage(){
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev)

            if(!prev.get("where") || !["reviews", "lists", "users"].includes(prev.get("where"))){
                params.set("where", "reviews")
            }

            if(!prev.get("sortBy")){
                params.set("sortBy", "createdAt")
            }
            if(!prev.get("order")){
                params.set("order", 1)
            }

            return params
        }, {replace: true})
    }, [setSearchParams])

    function handleSearchPlace(place){
        setSearchParams(prev => {
            const params = new URLSearchParams(prev)
            params.set("where", place)
            params.set("sortBy", "createdAt")
            params.set("order", 1)

            params.delete("minRating")
            params.delete("maxRating")
            params.delete("minDate")
            params.delete("maxDate")
            params.delete("categories")

            return params
        }, {replace: true})
    }

    function handleSortBy(sortBy){
        setSearchParams(prev => {
            const params = new URLSearchParams(prev)
            params.set("sortBy", sortBy.sortBy)
            params.set("order", +sortBy.order)

            return params
        }, {replace: true})
    }

    function handleSetFilters(filters){
        console.log(filters)

        setSearchParams(prev => {
            const params = new URLSearchParams()
            params.set("search", prev.get("search"))
            params.set("where", prev.get("where"))
            params.set("sortBy", prev.get("sortBy"))
            params.set("order", prev.get("order"))

            for(const [key, value] of Object.entries(filters)){
                params.set(key, value)
            }

            return params
        }, {replace: true})
    }

    const queryFunction = searchParams.get("where") === "users" ? getUsers : getPosts

    const {data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: [`${searchParams.toString()}`],
        queryFn: ({signal, pageParam = 1}) => {
            return queryFunction({
                signal,
                ...(searchParams.get("where") != "users" ? {type: searchParams.get("where")} : {}),
                page: pageParam,
                searchParams: searchParams,   
            })
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage[searchParams.get("where")].length == 0 ? undefined : allPages.length + 1
        }
        
    })

    let content = <></>
    if(data){
        const posts = data.pages.map(page => page[searchParams.get("where")]).flat(1)
        content = <PostList type={searchParams.get("where")} posts={posts}/>
        if(posts.length === 0) content = <h2>There is no results for this search...</h2>
    }

    return <div className={classes["search-page"]}>
        
        <div className={classes["tabs-div"]}>
            <TabButton onClick={() => handleSearchPlace("reviews")} isActive={searchParams.get("where") == "reviews"}>Reviews</TabButton>
            <TabButton onClick={() => handleSearchPlace("lists")} isActive={searchParams.get("where") == "lists"}>Lists</TabButton>
            <TabButton onClick={() => handleSearchPlace("users")} isActive={searchParams.get("where") == "users"}>Profiles</TabButton>
        </div>
        
        <div className={classes["sort-div"]}>
            <div className={classes["select-div"]} >
                <label htmlFor="type"hidden>Sort by</label>
                <select id="type" value={JSON.stringify({sortBy: searchParams.get("sortBy"), order: +searchParams.get("order")})} onChange={(e) => handleSortBy(JSON.parse(e.target.value))} >
                    <option value={JSON.stringify({sortBy: 'createdAt', order: -1})}>Newest Posts</option>
                    <option value={JSON.stringify({sortBy: 'createdAt', order: 1})}>Earliest Posts</option>
                    <option value={JSON.stringify({sortBy: 'rating', order: -1})}>Highest Ratings</option>
                    <option value={JSON.stringify({sortBy: 'rating', order: 1})}>Lowest Ratings</option>
                </select>
            </div>
        </div>

        <div className={classes["filters-and-content"]}>
            <FiltersForm 
                type={searchParams.get("where")}
                inicialFilterValues={{
                    minRating: searchParams.get("minRating"),
                    maxRating: searchParams.get("maxRating"),
                    minDate: searchParams.get("minDate"),
                    maxDate: searchParams.get("maxDate"),
                    categories: searchParams.get("categories")
                }}
                onSetFilters={handleSetFilters}    
            />
            
            <div className={classes["content-div"]}>
                {isPending && <LoaderDots />}
                {isError && <ErrorCard />}

                {content}
            </div>
            
        </div>

        {isFetchingNextPage && <LoaderDots />}
        <LoadMoreObserver fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />

    </div>
}

