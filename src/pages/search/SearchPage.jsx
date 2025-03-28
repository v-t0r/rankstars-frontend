import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import classes from "./SearchPage.module.css"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getPosts } from "../../services/posts"

import PostList from "../../components/postList/PostList"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import ErrorCard from "../../components/errorCard/ErrorCard"
import { getUsers } from "../../services/users"

export default function SearchPage(){
    const [searchParams, setSearchParams] = useSearchParams()

    const searchTerm = decodeURIComponent(searchParams.get("search"))

    useEffect(() => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev)

            if(!prev.get("where") || !["reviews", "lists", "users"].includes(prev.get("where"))){
                params.set("where", "reviews")
            }
            return params
        }, {replace: true})
    }, [setSearchParams])

    function handleSearchPlace(place){
        setSearchParams(prev => {
            const params = new URLSearchParams(prev)
            params.set("where", place)
            return params
        }, {replace: true})
    }

    let queryFn = null
    switch(searchParams.get("where")) {
        case "reviews": 
            queryFn = () => getPosts({type: "reviews", searchTerm: searchTerm})
            break
        case "lists":
            queryFn = () => getPosts({type: "lists", searchTerm: searchTerm})
            break
        case "users": 
            queryFn = () => getUsers({searchTerm: searchTerm})
            break
    }

    const {data, isPending, isError} = useQuery({
        queryKey: [`${searchParams.get("where")}`, `${searchTerm}`],
        queryFn: queryFn
    })

    return <div className={classes["search-page"]}>
        
        <div className={classes["tabs-div"]}>
            <TabButton onClick={() => handleSearchPlace("reviews")} isActive={searchParams.get("where") == "reviews"}>Reviews</TabButton>
            <TabButton onClick={() => handleSearchPlace("lists")} isActive={searchParams.get("where") == "lists"}>Lists</TabButton>
            <TabButton onClick={() => handleSearchPlace("users")} isActive={searchParams.get("where") == "users"}>Profiles</TabButton>
        </div>
        
        {isPending && <LoaderDots />}
        {isError && <ErrorCard />}

        {data && <PostList type={searchParams.get("where")} posts={data[searchParams.get("where")]}/>}
        {data && data[searchParams.get("where")].length === 0 && <h2>There is no results for this search...</h2>}

    </div>
}

function TabButton({onClick, isActive, children}){
    return <div className={classes["tab-button"]}>
        <button onClick={onClick}>{children}</button>
        {isActive && <motion.div layoutId="active-tab" className={classes["active-tab"]}></motion.div>}
    </div>
}