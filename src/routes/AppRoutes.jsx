import { createBrowserRouter, RouterProvider } from "react-router-dom"

import {checkAuthLoader, checkNotAuthLoader, tokenLoader} from "../services/auth.js"

import RootLayout from '../pages/RootLayout.jsx'
import LoginRoute, { action as loginAction} from '../pages/LoginPage.jsx'
import SignupRoute, {action as signupAction} from "../pages/SignupPage.jsx"
import {action as logoutAction} from "../pages/LogoutPage.jsx"
import FeedPage from '../pages/FeedPage.jsx'
import ProfileRoute from '../pages/ProfilePage.jsx'
import ReviewRoute from '../pages/ReviewPage.jsx'
import ReviewsPage from "../pages/ReviewsPage.jsx"
import EditReview from "../pages/EditReviewPage.jsx"
import ListRoute from '../pages/ListPage.jsx'

import ErrorRoute from '../pages/ErrorPage.jsx'

const router = createBrowserRouter([
    { path : "/", element: <RootLayout />, id: "root", errorElement: <ErrorRoute />, loader: tokenLoader, children: [
      {path: "/", loader: checkAuthLoader, children: [
        {path: "/", element: <FeedPage />},
        {path: "/review/:id", element: <ReviewRoute />},
        {path: "/review/:id/edit-review", element: <EditReview />},
        {path: "/review/new-review", element: <EditReview />},
        {path: "/list/:id", element: <ListRoute />},
        {path: "/profile", element: <ProfileRoute />},
        {path: "profile/:id", element: <ProfileRoute />},
        {path: "profile/:id/reviews", element: <ReviewsPage /> },
        {path: "/logout", action: logoutAction }
      ]},
      {path: "/", loader: checkNotAuthLoader, children: [
        {path: "/login", element: <LoginRoute />, action: loginAction },
        {path: "/signup", element: <SignupRoute />, action: signupAction },
      ]},
    ]}
])

export default function AppRoutes() {

    return (
        <RouterProvider router={router}/>
      )
}