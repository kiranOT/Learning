import Navbar from 'react-bootstrap/Navbar';
import PropTypes from 'prop-types'
import { useState } from 'react';

function DarkOnOffNavi({ title, phone }) {
  const [myStyle, SetMyStyle] = useState(true)
  const [btnText, SetBtnText] = useState("Enable Dark mode")
  return (
    <Navbar style={myStyle ? { backgroundColor: "white", color: "black" } : { backgroundColor: "black", color: "white" }}>
      <ul style={{display:"flex",gap:"2rem",listStyle:"none"}}>
        <li>Home</li>
        <li>News</li>
        <li>About us</li>
        <li>Profile</li>
        <button onClick={() => {
          if (myStyle) {
            SetMyStyle(false)
            SetBtnText("Disable Dark mode")
          }
          else {
            SetMyStyle(true)
            SetBtnText("Enable Dark mode")
          }
        }}>{btnText}</button>
      </ul>
    </Navbar>
  );
}


DarkOnOffNavi.propTypes = {
  title: PropTypes.string.isRequired,
  phone: PropTypes.number,
}

DarkOnOffNavi.defaultProps = {
  title: "Title",
  phone: 9876543210
}

export default DarkOnOffNavi;