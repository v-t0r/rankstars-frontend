import { useSearchParams } from "react-router-dom"
import classes from "./SearchPage.module.css"
import { useState } from "react"

export default function SearchPage(){
    const [searchParams] = useSearchParams()

    const [searchPlace, setSearchPlace] = useState("reviews")

    return <>
        <h1>Search Results</h1>
        <button onClick={() => setSearchPlace("reviews")}>Reviews</button>
        <button onClick={() => setSearchPlace("lists")}>Lists</button>
        <button onClick={() => setSearchPlace("profile")}>Profiles</button>

        <p>Pesquisando em {searchPlace}</p>


        <p>Sua pesquisa foi: {decodeURIComponent(searchParams.get("search"))}</p>
    </>
}