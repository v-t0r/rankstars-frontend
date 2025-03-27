import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import classes from "./SearchPage.module.css"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getPosts } from "../../services/posts"

import PostList from "../../components/postList/PostList"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import ErrorCard from "../../components/errorCard/ErrorCard"

export default function SearchPage(){
    const [searchParams] = useSearchParams()
    const [searchPlace, setSearchPlace] = useState("reviews")

    const searchTerm = decodeURIComponent(searchParams.get("search"))

    let queryFn = null
    switch(searchPlace) {
        case "reviews": 
            queryFn = () => getPosts({type: "reviews", searchTerm: searchTerm})
            break
        case "lists":
            queryFn = () => getPosts({type: "lists", searchTerm: searchTerm})
            break
        case "profiles": 
            queryFn = () => getPosts({type: "lists", searchTerm: searchTerm})
            break
    }

    const {data, isPending, isError} = useQuery({
        queryKey: [`${searchPlace}`, `${searchTerm}`],
        queryFn: queryFn
    })

    if(data){
        console.log(data[searchParams])
    }

    return <div className={classes["search-page"]}>
        
        <div className={classes["tabs-div"]}>
            <TabButton onClick={() => setSearchPlace("reviews")} isActive={searchPlace == "reviews"}>Reviews</TabButton>
            <TabButton onClick={() => setSearchPlace("lists")} isActive={searchPlace == "lists"}>Lists</TabButton>
            <TabButton onClick={() => setSearchPlace("profile")} isActive={searchPlace == "profile"}>Profiles</TabButton>
        </div>
        
        {isPending && <LoaderDots />}
        {isError && <ErrorCard />}


        {data && <PostList type={searchPlace} posts={data[searchPlace]}/>}
        {data && data[searchPlace].length === 0 && <h2>There is no results for this search...</h2>}

    </div>
}

function TabButton({onClick, isActive, children}){
    return <div className={classes["tab-button"]}>
        <button onClick={onClick}>{children}</button>
        {isActive && <motion.div layoutId="active-tab" className={classes["active-tab"]}></motion.div>}
    </div>
}