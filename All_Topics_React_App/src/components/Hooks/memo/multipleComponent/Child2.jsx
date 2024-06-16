import { memo } from "react"
import Child3 from "./Child3";
function Child2() {
  function renderedCount() {
    console.log("Child rendered..2");
  }
  return (
    <>
      <h4>Child 2</h4>
      <Child3 />
      {renderedCount()}
    </>
  )
}


export default Child2
