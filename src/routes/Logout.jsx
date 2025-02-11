import { redirect } from "react-router-dom"

export function action(){
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiration")
    localStorage.removeItem("userId")
    return redirect("/login")
}