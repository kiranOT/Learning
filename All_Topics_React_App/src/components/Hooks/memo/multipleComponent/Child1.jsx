import { memo } from "react"
import Child2 from "./Child2";
function Child1() {
  function renderedCount() {
    console.log("Child rendered..1");
  }
  return (
    <>
      <h4>Child 1</h4>
      <Child2 />
      {renderedCount()}
    </>
  )
}


export default (Child1)