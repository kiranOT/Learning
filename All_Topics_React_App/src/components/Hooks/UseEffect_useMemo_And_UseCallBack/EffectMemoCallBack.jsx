import { useMemo, useCallback, useEffect, useState } from "react"

const EffectMemoCallBack = () => {
    let [effectVal, SetEffectVal] = useState(0)
    let [count, SetCount] = useState(0)
    let [state1, SetState1] = useState(0)
    let [state2, SetState2] = useState(0)
    let [state3, SetState3] = useState(0)

    //============= All use for run  particular state=============


    // It's run for Effect
    useEffect(() => {
        console.log("useEffect Running..");
        SetEffectVal(state1)
    }, [state1])



    // It's run for optimize any reusable value.
    // It should only return a value
    let useMemoVal = useMemo(() => {
        console.log("useMemo Running..");
        return state2;
    }, [state2])


    // It's run for optimize any reusable function.
    // It should only return a function
    // returns a memoized version of that function
    // It update function only when passed dependencies state update otherwise it return previous updated function from memoize cache.
    let useCallbackMyFoo = useCallback(() => {
        const myFoo1 = () => {
            console.log("useCallback Running.." + count);
            return state3
        }
        return myFoo1
    }, [state3])

    return (
        <>
            <center><h3>useEffect, useMemo and useCallBack</h3></center>
            <hr className="w-100 h-2" />
            <p> Effect--{">" + effectVal}</p>
            <p> Memo--{">" + useMemoVal}</p>
            <p> CallBack--{">  " + useCallbackMyFoo()()}</p>
            <hr className="w-100 h-2" />
            <div>
                <h4>State1 -{">"} {state1}</h4>
                <button className="bg-blue-200 border-2 rounded hover:bg-red-700" onClick={() => { SetState1(state1 + 1) }}>Add + 1</button>
            </div>
            <hr className="w-100" />
            <div>
                <h4>State2 -{">"} {state2}</h4>
                <button className="bg-blue-200 border-2 rounded hover:bg-red-700" onClick={() => { SetState2(state2 + 1) }}>Add + 1</button>
            </div>
            <hr className="w-100" />
            <div>
                <h4>State3 -{">"} {state3}</h4>
                <button className="bg-blue-200 border-2 rounded hover:bg-red-700" onClick={() => { SetState3(state3 + 1) }}>Add + 1</button>
            </div>
            <hr className="w-100" />
            <div>
                <h4>count -{">"} {count}</h4>
                <button className="bg-blue-200 border-2 rounded hover:bg-red-700" onClick={() => { SetCount(count + 1) }}>Add + 1</button>
            </div>
        </>



    )
}

export default EffectMemoCallBack