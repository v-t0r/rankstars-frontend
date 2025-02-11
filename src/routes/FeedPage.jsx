import { NavLink } from 'react-router-dom'

export default function FeedPage(){

    return (
        <>
          <h1>Main Page!</h1>
          <NavLink to="/review/new-review">Novo Review</NavLink>
        </>
      )
}