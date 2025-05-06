import classes from "./ListPage.module.css"
 
import { useEffect } from "react"

import { Link, useParams, useSearchParams } from "react-router-dom"
import { useQuery} from "@tanstack/react-query"

import { getPost } from "../../services/posts.js"

import DetailedReviewCard from "../../components/cards/reviewCard/DetailedReviewCard.jsx"
import OptionsBar from "../../components/optionsBar/OptionsBar.jsx"
import CommentContainer from "../../components/comments/CommentContainer.jsx"
import LoaderDots from "../../components/loaderDots/LoaderDots.jsx"
import ErrorCard from "../../components/errorCard/ErrorCard.jsx"
import PageSelector from "../../components/pageSelector/pageSelector.jsx"
import { ITEMS_PER_PAGE } from "../../utils/constants.js"

export default function ListPage(){
    const {id: listId} = useParams()

    const [searchParams, setSearchParams] = useSearchParams()
    const paramsObject = Object.fromEntries(searchParams.entries())

    const {data, isPending, isError, error} = useQuery({
        queryKey: ["list", `${listId}`, `${paramsObject.sortBy}`, `${paramsObject.order}`, `${paramsObject.page}`],
        queryFn: ({signal}) => getPost({postId: listId, type: "lists", signal, sortBy: paramsObject.sortBy, order: +paramsObject.order, page: +paramsObject.page}),
        retry: false,
    })

    useEffect(() => {

        setSearchParams((prev) => {
            const params = new URLSearchParams(prev)

            if(!searchParams.get("page")){
                params.set("page", 1)
            }
            if(!searchParams.get("sortBy")){
                params.set("sortBy", "userOrder")
            }
            if(!searchParams.get("order")){
                params.set("order", 1)
            }

            //página maior que o máximo
            if(data){
                if( +searchParams.get("page") >  Math.ceil(data.list.reviewsCount/ITEMS_PER_PAGE)){
                    params.set("page", 1)
                } 
            }

            return params
        }, {replace: true})

    }, [searchParams, setSearchParams, data])

    function handleSortBy({sortBy, order}){
        const params = new URLSearchParams(searchParams)

        params.set("sortBy", sortBy)
        params.set("order", order)

        setSearchParams(params)
    }

    function handlePageChange(newPageNumber){
        const params = new URLSearchParams(searchParams)
        params.set("page", newPageNumber)
        setSearchParams(params)
    }

    let content
    if(isPending){
        content = <LoaderDots />
    }

    if(isError){
        content = <ErrorCard 
            title={error.status === 404 ? "404: List Not Found!" : undefined} 
            message={error.status === 404 ? "Are you sure this is the address you are looking for?" : undefined}
        />
    }

    if(data){
        const list = data.list
        const totalPages = Math.ceil(list.reviewsCount / ITEMS_PER_PAGE)
        
        content = <div className={classes["main-container"]}>
            
            <div className={classes["title-div"]}>
                <h1>{list.title}</h1>
                <h2>a list by <Link to={`/profile/${list.author._id}`}>{list.author.username}</Link></h2>
                <p>{list.description}</p>
            </div>
            <div className={classes["select-div"]} >
                <label htmlFor="type"hidden>Sort by</label>
                <select id="type" value={JSON.stringify({sortBy: paramsObject.sortBy, order: +paramsObject.order})} onChange={(e) => handleSortBy(JSON.parse(e.target.value))} >
                    
                    <option value={JSON.stringify({sortBy: 'userOrder', order: 1})}>User Order</option>
                    <option value={JSON.stringify({sortBy: 'createdAt', order: -1})}>Newest Posts</option>
                    <option value={JSON.stringify({sortBy: 'createdAt', order: 1})}>Earliest Posts</option>
                    <option value={JSON.stringify({sortBy: 'rating', order: -1})}>Highest Ratings</option>
                    <option value={JSON.stringify({sortBy: 'rating', order: 1})}>Lowest Ratings</option>

                </select>
            </div>

            
            <div className={classes["reviews-div"]}>
                {list.reviews.length === 0 && 
                    <div className={classes["empty-warning"]}>
                        <h2>This list is still empty...</h2>
                        <p>Come back in the future!</p>
                    </div>
                }

                <ul>
                    {list.reviews.map(review => {
                        return <li key={review._id} ><DetailedReviewCard review={review}/></li>
                    })}
                </ul>

                {list.reviewsCount > ITEMS_PER_PAGE && 
                    <div className={classes["page-buttons-div"]}>
                        <PageSelector 
                            currentPage={+paramsObject.page} 
                            totalPages={totalPages} 
                            onPageChange={handlePageChange} 
                        />
                    </div>
                }
                
            </div>
            
            <div className={classes["options-bar-div"]}>
                <OptionsBar post={list} type={"lists"} />
            </div>

            <CommentContainer postId = {list._id} type="lists"/>

        </div>
    }

    return <>
        {content}
    
    </>
}