import { createBrowserRouter, RouterProvider } from "react-router-dom"

import {checkAuthLoader, checkNotAuthLoader, tokenLoader} from "../services/auth.js"

import RootLayout from '../pages/layouts/RootLayout.jsx'
import LoginRoute, { action as loginAction} from '../pages/login/LoginPage.jsx'
import SignupRoute, {action as signupAction} from "../pages/login/SignupPage.jsx"
import {action as logoutAction} from "../pages/login/LogoutPage.jsx"
import FeedPage from '../pages/homePage/FeedPage.jsx'
import ProfileRoute from '../pages/profile/ProfilePage.jsx'
import ReviewRoute from '../pages/reviews/ReviewPage.jsx'
import ReviewsPage from "../pages/reviews/ReviewsPage.jsx"
import EditReview from "../pages/reviews/EditReviewPage.jsx"
import ListRoute from '../pages/lists/ListPage.jsx'

import ErrorRoute from '../pages/errors/ErrorPage.jsx'

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