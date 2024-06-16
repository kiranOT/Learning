import { useState } from "react"

const StateHook = () => {
    let [states, SetStates] = useState(0)

    return (
        <>
            <h4>state</h4>
            <h4>{states}</h4>
            <button className="border-2 bg-blue-400 rounded-md" onClick={() => {
                SetStates((states) => states + 1) // for multiple updates  
                SetStates((states) => states + 1) // for multiple updates  
            }}>Add 2</button>
        </>
    )
}

export default StateHook