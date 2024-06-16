import React, { useEffect, useLayoutEffect, useRef } from 'react'

const UseLayoutEffect = () => {
    const refer = useRef()

    useEffect(() => {
        const dimension = refer.current.getBoundingClientRect()
        console.log(dimension);
        refer.current.style.paddingTop = `${dimension.height+100}px`
    },[])

    // useLayoutEffect(() => {
    //     const dimension = refer.current.getBoundingClientRect()
    //     console.log(dimension);
    //     refer.current.style.paddingTop = `${dimension.height+100}px`
    // },[])

    return (
        <div ref={refer}>UseLayoutEffect</div>
    )
}

export default UseLayoutEffect