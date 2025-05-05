import classes from "./ReviewsPage.module.css"

import { Link, useParams, useSearchParams } from "react-router-dom"

import PostList from "../../components/postList/PostList"
import { fetchUserInfo, fetchUserReviews } from "../../services/users"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import LoadMoreObserver from "../../components/loadMoreObserver/LoadMoreObserver"
import FiltersForm from "../../components/filtersForm/FiltersForm"
import { getPostsCategories } from "../../services/posts"
import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import Modal from "../../components/modal/Modal"

export default function ReviewsPage() {
    const [searchParams, setSearchParams] = useSearchParams({sortBy: "createdAt", order: -1})
    const [modalVisibility, setModalVisibility] = useState(false)
    const isSmallWidth = useMediaQuery({query: "(max-width: 750px)"})

    const {id} = useParams()

    const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: [ "reviews", "user", `${id}`, `${searchParams.toString()}`],
        queryFn: ({ signal, pageParam = 1 }) => fetchUserReviews({signal, userId: id, searchParams: searchParams.toString() , page: pageParam}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.reviews.length == 0 ? undefined : allPages.length + 1
        }
    })

    const { data: userData } =  useQuery({
        queryKey: ["username", `${id}`],
        queryFn: ({signal}) => fetchUserInfo({signal, id, basicOnly: true})
    })

    const { data: categoriesData } = useQuery({
        queryKey: [`${id}`, `${searchParams.toString()}`, "reviews", "categories"],
        queryFn: ({signal}) => {
            let paramsAndAuthor = new URLSearchParams(searchParams)
            paramsAndAuthor.set("author", id)
            return getPostsCategories({signal, type: "reviews", searchParams: paramsAndAuthor})}
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
        type={"reviews"}
        inicialFilterValues={{
            minRating: searchParams.get("minRating"),
            maxRating: searchParams.get("maxRating"),
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
            <h2>Error while fetching this user reviews. Please, try again later.</h2>
        </>
    }

    if(data) { 
        const reviews = data.pages.map(page => page.reviews).flat(1) 
        content = <PostList type="reviews" posts={reviews} />
    }

    return <div className={classes["general-container"]}>
        <div className={classes["header-section"]}>   
            <h1><Link className="inverted" to={`/profile/${id}`}>{userData?.user?.username ?? "user"}</Link>&apos;s reviews</h1>
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
                    <option value={JSON.stringify({sortBy: 'rating', order: -1})}>Highest Ratings</option>
                    <option value={JSON.stringify({sortBy: 'rating', order: 1})}>Lowest Ratings</option>
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
                    <h3 className={classes["no-more-reviews-message"]}>It&apos;s a dead end! No more reviews to load.</h3>
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