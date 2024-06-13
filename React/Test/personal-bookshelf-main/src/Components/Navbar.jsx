import React from "react";
// import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useCallback } from "react";


const Navbar = React.memo(({searchTerm, onSearchChange, setResults}) => {
  const handleSearchTerm = (e) => {
    onSearchChange(e.target.value);
  }

  const debouncedSetResults = useCallback(debounce(setResults, 300), [setResults]);


  const handleSearch = () => {
    debouncedSetResults(searchTerm)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      debouncedSetResults(searchTerm);
    }
  };

  return (
    <nav className="max-w-screen bg-[#101214] h-14">
      <ul className="flex justify-between items-center h-full p-2 w-full gap-6">
        <li className="flex justify-center items-center h-12 w-[22%]"><p className="font-extrabold text-[#ffffff] text-3xl">BOOKZ</p></li>
        <li className="flex justify-center items-center h-12 px-5 w-[63.33%]">
          <div className="w-full h-6 flex justify-end gap-2 items-center">
            <input type="text" value={searchTerm} onChange={handleSearchTerm} onKeyDown={handleKeyPress} className="md:w-[20%] w-[80%] focus:w-[80%] transition-all focus:duration-1000 ease-in-out rounded-xl h-8 outline-none p-3 text-lg bg-[#FFFFFF]" placeholder="Search Books..."/>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#D8EFD3" className="size-6 cursor-pointer" onClick={handleSearch}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17L21 21" stroke="#fffafa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#fffafa" strokeWidth="2"></path> </g></svg>
          </div>
        </li>
      
        <li className="flex justify-start items-center h-12 w-[10.33%]">
          <div className="w-6 h-6">
          <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 3.99995C12.8839 2.91716 14.9355 2.15669 17.07 1.74995C17.551 1.63467 18.0523 1.63283 18.5341 1.74458C19.016 1.85632 19.4652 2.07852 19.8464 2.39375C20.2276 2.70897 20.5303 3.10856 20.7305 3.56086C20.9307 4.01316 21.0229 4.50585 21 4.99995V13.9999C20.9699 15.117 20.5666 16.1917 19.8542 17.0527C19.1419 17.9136 18.1617 18.5112 17.07 18.7499C14.9355 19.1567 12.8839 19.9172 11 20.9999" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.9995 3.99995C9.1156 2.91716 7.06409 2.15669 4.92957 1.74995C4.44856 1.63467 3.94731 1.63283 3.46546 1.74458C2.98362 1.85632 2.53439 2.07852 2.15321 2.39375C1.77203 2.70897 1.46933 3.10856 1.26911 3.56086C1.0689 4.01316 0.976598 4.50585 0.999521 4.99995V13.9999C1.0296 15.117 1.433 16.1917 2.14533 17.0527C2.85767 17.9136 3.83793 18.5112 4.92957 18.7499C7.06409 19.1567 9.1156 19.9172 10.9995 20.9999" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11 21V4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </div>
        </li>
      </ul>
    </nav>
  );
});

export default Navbar;
