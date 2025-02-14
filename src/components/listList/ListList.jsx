import { useSelector } from "react-redux"
import classes from "./ListList.module.css"
import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchUserLists } from "../../services/users"
import CheckBoxInput from "../checkBoxInput.jsx/CheckBoxInput"
import { addReviewToList, removeReviewFromList } from "../../services/posts"
import { queryClient } from "../../services/queryClient"
import { useEffect } from "react"

export default function ListList({review, onClose}){
    const userId = useSelector(state => state.user.user._id)

    const {data, isPending, isError} = useQuery({
        queryKey: ["lists", "user", `${userId}`],
        queryFn: ({signal}) => fetchUserLists(signal, userId),
        staleTime: 0
    })

    const {mutate: addReviewtoListMutate} = useMutation({
        mutationFn: addReviewToList,
        onSuccess: () => {
            queryClient.invalidateQueries({refetchType: "active"})
        }
    })

    const {mutate: removeReviewFromListMutate} = useMutation({
        mutationFn: removeReviewFromList,
        onSuccess: () => {
            queryClient.invalidateQueries({refetchType: "active"})
        }
    })

    useEffect(() => {
        queryClient.invalidateQueries(["lists", "user", `${userId}`])
    }, [userId])

    function handleSubmit(event){
        event.preventDefault()
        const formData = new FormData(event.target)
    
        const checkedLists = formData.getAll("list")
        
        //lists that was not checked and the user checked
        const newCheckedLists = checkedLists.filter(list => !listsContainingReview.includes(list))
        
        //lists that was checked and the user unchecked 
        const uncheckedLists = listsContainingReview.filter(list => !checkedLists.includes(list))

        newCheckedLists.forEach(list => addReviewtoListMutate({reviewId: review._id, listId: list}))
        uncheckedLists.forEach(list => removeReviewFromListMutate({reviewId: review._id, listId: list}))

        onClose()
    }

    let listsContent
    if(isPending){
        listsContent = <p>Loading your lists...</p>
    }
    if(isError){
        listsContent = <p>Error while loading your lists. Please, try again later!</p>
    }

    let listsContainingReview
    if(data){
        const lists = data.lists
        listsContainingReview = lists.filter(list => review.lists.includes(list._id))
        listsContainingReview = listsContainingReview.map(list => list._id)

        listsContent = lists.map((list) => {
            return <div className={classes["list-item"]} key={list._id}>
                <CheckBoxInput 
                    name={`list`} 
                    value={list._id} 
                    label={list.title} 
                    size="1.5rem" 
                    fontSize="1.2rem" 
                    checked={listsContainingReview.includes(list._id)} 
                />
                <p>{list.title}</p>
            </div>
        })
    }

    return <div className={classes["main-container"]}>
        <div className={classes["title-container"]}>
            <h1>Add to a List</h1>
            <button onClick={onClose} className={`negative-button ${classes["close-button"]}`}>X</button>
        </div>

        <div className={classes["lists-div"]}>
            <form onSubmit={handleSubmit}>
                <div className={classes["lists-list"]}>
                {listsContent}
                </div>
                <div className={classes["action-buttons"]}>
                    <button type="button" className="negative-button" onClick={onClose}>cancel</button>
                    <button type="submit" className={"button secondary-button"}>Save</button>
                </div>
                
            </form>
        </div>

    </div>
}