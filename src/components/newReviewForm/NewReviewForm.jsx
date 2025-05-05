import classes from "./NewReviewForm.module.css"

import {useMutation, useQuery} from "@tanstack/react-query"

import { getPost, postReview, patchPost } from "../../services/posts";

import { queryClient } from "../../services/queryClient";
import { useEffect, useState } from "react";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import ImagesPicker from "../imagesPicker/ImagesPicker";
import { AnimatePresence } from "framer-motion";
import LoaderDots from "../../components/loaderDots/LoaderDots";
import ErrorCard from "../../components/errorCard/ErrorCard"

import { INTERESTS_LIST } from "../../utils/constants";

export default function NewReviewForm({reviewId = undefined, onCancel}){
    const [validationErrors, setValidationErrors] = useState([])
    const [modal, setModal] = useState(false) //false is closed, true is opened
    const [form, setForm] = useState({
        title: "",
        rating: "",
        review: "",
        type: INTERESTS_LIST[0][0],
        images: []
    })

    const {data, isError, isPending} = useQuery({
        queryKey: ["user", "review", `${reviewId}`],
        queryFn: ({signal}) => getPost({postId: reviewId, type: "reviews", signal}),
        enabled: reviewId !== undefined
    })

    const mutationFunction = reviewId ? patchPost : postReview

    const { mutate } = useMutation({
        mutationFn: mutationFunction,
        onSuccess: () => {
            queryClient.invalidateQueries()
            onCancel()
        }
    })

    useEffect(() => {
        if(data){
            const reviewImages = (data.review.imagesUrls[0] === "images/default-review-pic.jpg") ? [] : data.review.imagesUrls

            setForm({
                title: data.review.title,
                rating: data.review.rating,
                review: data.review.review,
                type: data.review.type,
                images: reviewImages
            })
        }

    }, [data])

    function handleImageChange(event){
        const selectedImages = Array.from(event.target.files)

        if(selectedImages.length > 0){
            const totalImages = [ ...form.images, ...selectedImages]
            setForm(prevState => ({...prevState, images: totalImages}))
        }

    }

    function handleImageRemove({index}){
        setForm(prevState => {
            const prevImages = [...prevState.images]
            prevImages.splice(index, 1)
            
            return {
                ...prevState,
                images: prevImages
            }
        })
    }

    function handleSubmit(event){
        event.preventDefault()
        const formData = new FormData(event.target)

        form.images.forEach(image => formData.append("image", image))

        const data = Object.fromEntries(formData)

        let errors = []

        if(data.title.trim().length === 0){
            errors = [...errors, (["title", "The title can't be empty!"])]
        }

        if(+data.rating < 0 || +data.rating > 100){
            errors = [...errors, (["rating", "Rating must be between 0 and 100."])]
        }

        if(data.rating === ""){
            errors = [...errors, (["rating", "Rating can't be empty."])]
        }

        if(errors.length > 0){
            setValidationErrors(errors)
            return
        }
        if(reviewId){
            mutate({id: reviewId, data: formData, type: "reviews"})
            return
        }

        mutate(formData)
    }

    let content
    if(isPending){
        content = <LoaderDots />
    }

    if(isError){
        content = <ErrorCard />
    }

    if(!reviewId || data){
    
        content = <form className={classes["form"]} onSubmit={handleSubmit} encType="multipart/form-data">
            <div className={classes["title-rating"]}>
                <div className={classes["title-input"]}>
                    <label htmlFor="title" hidden>Title</label>
                    <input type="text" name="title" id="title" placeholder="TITLE" value={form.title} onChange={(e) => setForm(state => ({...state, title: e.target.value}))}/>
                    {validationErrors.map((error, index) => error[0] === "title" && <p key={index} className="error-text">{error[1]}</p>)}
                    {validationErrors.map((error, index) => error[0] === "rating" && <p key={index} className="error-text">{error[1]}</p>)}
                </div>

                <div className={classes["rating-input"]}>
                    <label htmlFor="title" hidden>Rating (0-100)</label>
                    <input type="text" name="rating" id="rating" placeholder="?" value={form.rating} maxLength="3" onChange={(e) => setForm(state => ({...state, rating: e.target.value}))}/>/100
                </div>
            </div>
            
            <div className="label-input">
                <label htmlFor="review" hidden>Review</label>
                <textarea name="review" id="review" placeholder="(This part is optional, by the way...)" value={form.review} onChange={(e) => setForm(state => ({...state, review: e.target.value}))} ></textarea>
            </div>

            <div className={classes["select-div"]} >
                <label htmlFor="type">Category</label>
                <select name="type" id="type" value={form.type} onChange={(e) => setForm(state => ({...state, type: e.target.value}))} >
                    {INTERESTS_LIST.map(([db_name, name], index) => {
                        return <option key={index} value={db_name}>{name}</option>
                    })}
                </select>
            </div>

            <div className={classes["image-picker-div"]}>
                <label>IMAGES</label>
                <ImagesPicker inputId={"image"} onChange={handleImageChange} onRemove={handleImageRemove} selectedImages={form.images}/>
            </div>

            <div className={classes["buttons"]}>
                <button  type="button" className="negative-button" onClick={() => setModal(true)}>cancel</button>
                <button className="button secondary-button" type="submit">{reviewId ? "Save" : "Post"}</button>
            </div>
        </form>
    }

    return <>
        {content}

        <AnimatePresence>
            {modal && <ConfirmationModal onEscape={() => setModal(false)}
                onConfirm={() => {setModal(false), onCancel()}}
                onCancel={() => setModal(false)}
                title={"Cancel Review"}
                message={"Are you sure you want cancel this review?"}
            />}
        </AnimatePresence>
    </>
}