import classes from "./HomePage.module.css"

import TabButton from '../../components/tabButton/TabButton'
import { useEffect, useState } from 'react'
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchFeed } from "../../services/feed"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import ErrorCard from "../../components/errorCard/ErrorCard"
import { useDispatch, useSelector } from "react-redux"
import DetailedReviewCard from "../../components/cards/reviewCard/DetailedReviewCard"
import DetailedListCard from "../../components/cards/listCard/DetailedListCard"
import { loginModalActions } from "../../store"
import FeedPost from "../../components/feedPost/FeedPost"

export default function FeedPage() {
  const [ feedType, setFeedType ] = useState("following")

  const loggedUserInfo = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if(!loggedUserInfo){
      setFeedType("recent-posts")
    }
    
    if(loggedUserInfo){
      setFeedType("following")
    }

  }, [loggedUserInfo])

  function handleSwitchTab(newTab){
    if(!loggedUserInfo){
      dispatch(loginModalActions.setLoginModalVisibility(true))
      return
    }
    setFeedType(newTab)
  }

  const {data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
    queryKey: ["feed", `${feedType}`, `${loggedUserInfo?.id}`],
    queryFn: ({signal, pageParam = 1}) => fetchFeed({signal, feedType: "following", page: pageParam}),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.posts.length == 0 ? undefined : allPages.length+1
    }
  })

  let content = <></>
  if(data){
    const posts = data.pages.map(page => page.posts).flat(1)

    content = <>
      <ul className={classes["posts-list"]}>
        {posts.map((post, index) => {
          return <li key={index}><FeedPost post={post}/></li>
        })}
      </ul>
      
    </>
  }

  return <>
    <div className={classes["tabs-div"]}>
      <TabButton onClick={() => setFeedType("recent-posts")} isActive={feedType == "recent-posts"} >Recent Posts</TabButton>
      <TabButton onClick={() => handleSwitchTab("following")} isActive={feedType == "following"} >Following</TabButton>
      <TabButton onClick={() => handleSwitchTab("for-you")} isActive={feedType == "for-you"} >For You</TabButton>
    </div>

    {data && content}  

    {isPending && <LoaderDots />}
    {isError && <ErrorCard />}
  </>
}