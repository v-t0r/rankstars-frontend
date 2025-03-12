import { useEffect, useRef } from "react"


export default function LoadMoreSensor({fetchNextPage, hasNextPage}){
    const ref = useRef()
    
    useEffect(() => {
        if(!hasNextPage){
            return
        }

        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting){
                fetchNextPage()
            }
        },
        {threshold: 1.0}
        )

        if(ref.current){
            observer.observe(ref.current)
        }

        return () => observer.disconnect()

    }, [hasNextPage, fetchNextPage])

    return <div ref={ref} ></div>
}