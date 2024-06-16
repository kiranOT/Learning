import { memo } from "react"
function Child3() {
  function renderedCount() {
    console.log("Child rendered..3");
  }
  return (
    <>
      <h4>Child 3</h4>

      {renderedCount()}
    </>
  )
}


export default Child3