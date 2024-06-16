import React from 'react'
import { useReducer } from 'react'

// Simple example of true/false value

// const UseReducer = () => {
//     let [state, dispatch] = useReducer((state, action) => {
//         return { bool: !state.bool }
//     }, { bool: true })
//     return (
//         <>
//             <p>{state.bool ? "yes" : "no"}</p>
//             <button onClick={() => { dispatch() }}>reverse</button>
//         </>
//     )
// }




// Simple example of counter

const UseReducer = () => {
    let [state, dispatch] = useReducer((state, action) => {
        switch (action) {
            case "increase":
                return { count: state.count + 1 }
                break;
            case "decrease":
                return { count: state.count - 1 }
                break;
            default:
                return state
        }
    }, { count: 0 })
    return (
        <>
            <p>{state.count}</p>
            <button onClick={() => { dispatch("increase") }}>increase</button>
            <button onClick={() => { dispatch("decrease") }}>decrease</button>
        </>
    )
}
export default UseReducer