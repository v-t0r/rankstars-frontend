import { useState } from "react"
import ImagePicker from "../imagePicker/ImagePicker"
import classes from "./EditUserForm.module.css"
import { useMutation } from "@tanstack/react-query"
import { pacthUser } from "../../services/users"
import { queryClient } from "../../services/queryClient"

import { useDispatch } from "react-redux"
import { userActions } from "../../store"

export default function EditUserForm({user, onClose}){

    const [userForm, setUserForm] = useState({
        username: user.username,
        status: user.status,
        image: user.profilePicUrl
    }) 

    const [validationErrors, setValidationErrors] = useState([])

    const dispatch = useDispatch()

    const { mutate } = useMutation({
        mutationFn: pacthUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries()
            dispatch(userActions.updateProfilePicture({profilePicUrl: data.user.profilePicUrl}))
            onClose()
        },
        onError: (error) => {
            const errors = error.info.data.map(error => [error.path, error.msg])
            setValidationErrors(errors)
        }
    })

    function handleImageChange(event){
        const selectedImage = event.target.files[0]
        console.log(selectedImage)
        setUserForm(prevState => ({...prevState, image: selectedImage}))
    }

    function handleImageRemove(){
        setUserForm(prevState => {
            return {
                ...prevState,
                image: undefined
            }
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append("image", userForm.image ?? undefined)
        const data = Object.fromEntries(formData)

        let errors = []

        if(data.username.trim().length === 0){
            errors = [...errors, ["username", "Username can't be empty."]]
        }

        if(errors.length > 0){
            setValidationErrors(errors)
            return
        }

        mutate(formData)
    }

    return <>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h1>Edit Profile</h1>
            <div className={classes["image-and-inputs"]}>
                <ImagePicker inputId="image" onChange={handleImageChange} onRemove={handleImageRemove} selectedImage={userForm.image} />
                <div className={classes["inputs-div"]}>
                    <div className={classes["label-input"]}>
                        <label htmlFor="username">Username</label>
                        <input type="username" name="username" value={userForm.username} onChange={(e) => setUserForm(prev => ({...prev, username: e.target.value}))}/>
                        {validationErrors.map((error, index) => error[0] === "username" && <p className="error-text" key={index}>{error[1]}</p>)}
                    </div>

                    <div className={classes["label-input"]}>
                        <label htmlFor="status">Status</label>
                        <textarea type="status" name="status" value={userForm.status} onChange={(e) => setUserForm(prev => ({...prev, status: e.target.status}))}/>
                    </div>
                </div>
            </div>
            
            <div className={classes["action-buttons"]}>
                <button  type="button" className="negative-button" onClick={onClose}>cancel</button>
                <button className="button secondary-button" type="submit">Save</button>
            </div>
        </form>
    </>
}