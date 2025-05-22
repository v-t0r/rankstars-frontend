import { createBrowserRouter, RouterProvider } from "react-router-dom"

import RootLayout from '../pages/layouts/RootLayout.jsx'
import HomePage from '../pages/homePage/HomePage.jsx'
import ProfilePage from '../pages/profile/ProfilePage.jsx'
import ReviewPage from '../pages/reviews/ReviewPage.jsx'
import ReviewsPage from "../pages/reviews/ReviewsPage.jsx"
import ListPage from '../pages/lists/ListPage.jsx'
import ErrorPage from '../pages/errors/ErrorPage.jsx'
import ListsPage from "../pages/lists/ListsPage.jsx"
import { authenticationLoader } from "../services/auth.js"
import SearchPage from "../pages/search/SearchPage.jsx"
import WelcomePage from "../pages/welcome/WelcomePage.jsx"

const router = createBrowserRouter([
    {path : "/", element: <RootLayout />, loader: authenticationLoader ,id: "root", errorElement: <ErrorPage />, children: [
      {path: "/", element: <WelcomePage />},
      {path: "/feed", element: <HomePage />},
      {path: "/profile/:id", element: <ProfilePage />},
      {path: "/profile/:id/reviews", element: <ReviewsPage /> },
      {path: "/profile/:id/lists", element: <ListsPage />},
      {path: "/review/:id", element: <ReviewPage />},
      {path: "/list/:id", element: <ListPage />},
      {path: "/profile", element: <ProfilePage />},
      {path: "/search", element: <SearchPage />}
    ]}
])

export default function AppRoutes() {
  
    return (
        <RouterProvider router={router}/>
      )
}