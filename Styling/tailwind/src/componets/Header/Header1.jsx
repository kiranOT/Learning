import React, { useState } from "react";

const Header1 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return <></>;
};

export default Header1;
