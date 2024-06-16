import React from 'react'
import PropTypes from 'prop-types'

const NavPage = props => {
    return (
        <div className='bg-gray-500 h-2rem`'>
            <div className="flex justify-between text-nowrap  mx-4 pt-1.5">
                <div>{props.title}</div>
                <div>
                    <ul className="flex gap-2">
                        <li>News</li>
                        <li>Course</li>
                        <li>About us</li>
                        <li>Contact us</li>
                    </ul>
                </div>
                <div>
                    <form className="flex">
                        <input className='bg-gray-200 border-2 rounded border-red-500 outline-none mr-4 hover:border-yellow-500 focus:border-blue-300 px-2' type="text" />
                        <button>search</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
NavPage.propTypes = {
    title: PropTypes.string.isRequired,
}
NavPage.defaultProps = {
    title: "React + Vite App"
}

export default NavPage