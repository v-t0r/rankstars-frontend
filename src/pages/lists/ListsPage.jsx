import classes from "./ListsPage.module.css"

import { Link, useParams, useSearchParams } from "react-router-dom"

import PostList from "../../components/postList/PostList"
import { fetchUserInfo, fetchUserLists } from "../../services/users"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import LoadMoreObserver from "../../components/loadMoreObserver/LoadMoreObserver"
import { ITEMS_PER_PAGE } from "../../utils/constants"
import { getPostsCategories } from "../../services/posts"
import { useMediaQuery } from "react-responsive"
import { useState } from "react"
import FiltersForm from "../../components/filtersForm/FiltersForm"
import Modal from "../../components/modal/Modal"

export default function ListsPage(){
    const [searchParams, setSearchParams] = useSearchParams({sortBy: "createdAt", order: -1})
    const [modalVisibility, setModalVisibility] = useState(false)
    const isSmallWidth = useMediaQuery({query: "(max-width: 750px)"})

    const {id} = useParams()
    
    const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: [ "lists", "user", `${id}`, `${searchParams.toString()}`],
        queryFn: ({ signal, pageParam=1 }) => fetchUserLists({signal, userId: id, searchParams: searchParams.toString(), page: pageParam}),
        getNextPageParam: (lastPage, allPages) => {
            return (lastPage.lists.length != ITEMS_PER_PAGE) ? undefined : allPages.length + 1
        }
    })

    const { data: userData } =  useQuery({
        queryKey: ["username", `${id}`],
        queryFn: ({signal}) => fetchUserInfo({signal, id, basicOnly: true})
    })

    const { data: categoriesData } = useQuery({
        queryKey: [`${id}`, `${searchParams.toString()}`, "lists", "categories"],
        queryFn: ({signal}) => {
            let paramsAndAuthor = new URLSearchParams(searchParams)
            paramsAndAuthor.set("author", id)
            return getPostsCategories({signal, type: "lists", searchParams: paramsAndAuthor})}
    })

    function handleChangeSort(newValue){
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)

            newParams.set("sortBy", newValue.sortBy)
            newParams.set("order", newValue.order)

            return newParams
        })
    }

    function handleSetFilters(filters){
        setSearchParams(prev => {
            const params = new URLSearchParams()
            params.set("sortBy", prev.get("sortBy"))
            params.set("order", prev.get("order"))

            for(const [key, value] of Object.entries(filters)){
                params.set(key, value)
            }

            return params
        }, {replace: true})

        setModalVisibility(false)
    }

    const filters = <FiltersForm
        type={"lists"}
        inicialFilterValues={{
            minDate: searchParams.get("minDate"),
            maxDate: searchParams.get("maxDate"),
            category: searchParams.get("category")
        }}
        onSetFilters={handleSetFilters}
        categoriesCount={categoriesData ? categoriesData.categories : []}
    />


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
                    {isSmallWidth && <button onClick={() => setModalVisibility(prev => !prev)} className={`button ${classes["filters-button"]}`}><span className={`material-symbols-outlined ${classes["filter-icon"]}`}>filter_list</span>Filters</button>}
                    <label htmlFor="type"hidden>Sort by</label>
                    <select 
                        id="type" 
                        value={JSON.stringify({sortBy: searchParams.get("sortBy"), order: +searchParams.get("order")})} 
                        onChange={(e) => handleChangeSort(JSON.parse(e.target.value))}
                    >
                        <option value={JSON.stringify({sortBy: 'createdAt', order: -1})}>Newest Posts</option>
                        <option value={JSON.stringify({sortBy: 'createdAt', order: 1})}>Earliest Posts</option>
                    </select>
                </div>
            </div>
        
        <div className={classes["content-div"]}>

            {!isSmallWidth && filters}

            <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                {content}
                {isFetchingNextPage && <LoaderDots/>}
                <LoadMoreObserver fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}/>
                {(!hasNextPage && data?.pages.length > 1) &&
                    <h3 className={classes["no-more-lists-message"]}>It&apos;s a dead end! No more lists to load.</h3>
                }
            </div>
        </div>
        
        {isSmallWidth && modalVisibility && <Modal onEscape={() => setModalVisibility(false)}>
            <div style={{display: "flex", justifyContent: "right"}}>
                <button className="negative-button" onClick={() => setModalVisibility(false)}>X</button>
            </div>
            {filters}
        </Modal>}
        
    </div>
}