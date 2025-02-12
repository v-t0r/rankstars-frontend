import { createBrowserRouter, RouterProvider } from "react-router-dom"
import FeedPage from './pages/FeedPage.jsx'
import RootLayout from './pages/RootLayout.jsx'
import ReviewRoute from './pages/Review.jsx'
import ProfileRoute from './pages/Profile.jsx'
import ListRoute from './pages/List.jsx'
import LoginRoute, { action as loginAction} from './pages/Login.jsx'
import SignupRoute, {action as signupAction} from "./pages/Signup.jsx"
import ErrorRoute from './pages/ErrorRoute.jsx'
import {action as logoutAction} from "./pages/Logout.jsx"
import {checkAuthLoader, checkNotAuthLoader, tokenLoader} from "./services/auth.js"
import EditReview from "./pages/EditReview.jsx"
import ReviewsPage from "./pages/ReviewsPage.jsx"

import './App.css'

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

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App