import { useContext } from "react"
import {data} from  "./UseContextHook"
export default function Drill4() {
    const val = useContext(data)
    return (
        <>
            <h4>{val}</h4>
        </>
    )
}