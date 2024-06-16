import { memo } from 'react';

function Child({ handleClick, newVal }) {
  console.log('Child Rendered'); // This will only log when handleClick reference changes

  return (
    <div>
      {/* <p>child --{">"+newVal}</p> */}
      <button onClick={handleClick}>Increment from Child</button>
    </div>
  );
}

export default memo(Child);
