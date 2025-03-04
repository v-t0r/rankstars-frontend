import { createBrowserRouter, RouterProvider } from "react-router-dom"

import {checkAuthentication, userContextLoader} from "../services/auth.js"

import RootLayout from '../pages/layouts/RootLayout.jsx'
import LoginPage, { action as loginAction} from '../pages/login/LoginPage.jsx'
import SignupPage, {action as signupAction} from "../pages/login/SignupPage.jsx"
import LogoutPage from "../pages/login/LogoutPage.jsx"
import HomePage from '../pages/homePage/HomePage.jsx'
import ProfilePage from '../pages/profile/ProfilePage.jsx'
import ReviewPage from '../pages/reviews/ReviewPage.jsx'
import ReviewsPage from "../pages/reviews/ReviewsPage.jsx"
import ListPage from '../pages/lists/ListPage.jsx'
import ErrorPage from '../pages/errors/ErrorPage.jsx'
import ListsPage from "../pages/lists/ListsPage.jsx"

const router = createBrowserRouter([
    { path : "/", element: <RootLayout />, id: "root", errorElement: <ErrorPage />, children: [
      {path: "/", loader: async() => { await userContextLoader(); return checkAuthentication(true)}, children: [
        {path: "/", element: <HomePage />},
        {path: "profile/:id", element: <ProfilePage />},
        {path: "profile/:id/reviews", element: <ReviewsPage /> },
        {path: "profile/:id/lists", element: <ListsPage />},
        {path: "/review/:id", element: <ReviewPage />},
        {path: "/list/:id", element: <ListPage />},
        {path: "/profile", element: <ProfilePage />},
      ]},
      {path: "/",  loader: async() => { await userContextLoader(); return checkAuthentication(false)}, children: [
        {path: "/login", element: <LoginPage />, action: loginAction },
        {path: "/signup", element: <SignupPage />, action: signupAction },
      ]},
      {path: "/", children: [
        {path: "/logout", element: <LogoutPage />}
      ]}
    ]}
])

export default function AppRoutes() {
  
    return (
        <RouterProvider router={router}/>
      )
}