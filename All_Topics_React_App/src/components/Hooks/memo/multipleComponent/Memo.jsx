import { useState, memo } from "react";
import Child1 from "./Child1";
import Child2 from "./Child2";
import Child3 from "./Child3";

function Memo() {
  let [count, setCount] = useState(0)
  function renderedCount() {
    console.log("Memo rendered..");
  }
  return (
    <>
      <h4>Memo</h4>
      {
        renderedCount()
      }
      <p>{count}</p>
      <button onClick={() => { setCount(count + 1) }}>add+1</button>

      <Child1 />
      {/* <Child2 />
      <Child3 /> */}
    </>
  )
}

export default Memo