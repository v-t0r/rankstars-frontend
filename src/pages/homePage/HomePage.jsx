import classes from "./HomePage.module.css"

import TabButton from '../../components/tabButton/TabButton'
import { useEffect, useState } from 'react'
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchFeed } from "../../services/feed"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import ErrorCard from "../../components/errorCard/ErrorCard"
import { useDispatch, useSelector } from "react-redux"
import { loginModalActions } from "../../store"
import FeedPost from "../../components/feedPost/FeedPost"
import LoadMoreObserver from "../../components/loadMoreObserver/LoadMoreObserver"

export default function FeedPage() {
  const [ feedType, setFeedType ] = useState("recent posts")

  const loggedUserInfo = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  const {data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
    queryKey: ["feed", `${feedType}`, `${loggedUserInfo?.id}`], 
    queryFn: ({signal, pageParam = undefined}) => fetchFeed({
        signal, 
        feedType: feedType, 
        olderThan: pageParam
    }),
    getNextPageParam: (lastPage) => {
        const postQnty = lastPage.posts.length
        return postQnty == 0 ? undefined : lastPage.posts[postQnty-1].createdAt
    }
  })

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

    {isFetchingNextPage && <LoaderDots />}

    <LoadMoreObserver fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />

    {isPending && <LoaderDots />}
    {isError && <ErrorCard />}
  </>
}