import { useState, useCallback, useMemo } from 'react';
import Child from "./Child"

function Parent() {
  console.log('Parent Rendered'); // This will only log when handleClick reference changes

  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [newVal, SetNewVal] = useState("ghg");

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]); // Dependency array ensures memoization


  const newVal1 = useMemo(() => {
    async function fetchData() {
      let res = await fetch("https://www.google.com")
      let result = await res.text()

      // console.log(res);
      return result
    }
    return fetchData()
  }, [])


  return (
    <div>
      {console.log(newVal1)}
      <Child handleClick={handleClick} newVal1={newVal1} />
      <button onClick={handleClick}>Increment ({count})</button>
      <br />
      <button onClick={() => { setCount1(count1 + 1) }}>Increment only parent 1({count1})</button>
      <br />
      {/* <p>Parent --{">" + newVal}</p> */}

      {/* <button onClick={() => { SetNewVal(newVal + 1) }}>newVal only parent 1({newVal})</button> */}
    </div>
  );
}

export default Parent