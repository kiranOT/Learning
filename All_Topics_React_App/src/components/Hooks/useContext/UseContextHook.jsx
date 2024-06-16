import Drill1 from "./Drill1"
import { createContext } from "react"

export const data = createContext()

const UseContextHook = () => {
  return (
    <>
      <data.Provider value='hello im from UseContextHook'>
        <Drill1 />
      </data.Provider>
    </>
  ) 
}

export default UseContextHook