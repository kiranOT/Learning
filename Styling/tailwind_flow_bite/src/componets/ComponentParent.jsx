import React from "react";
import HeaderParent from "./Header/HeaderParent";
import FormParent from "./Forms/FormParent";
import SpinnerParent from "./Spinner/SpinnerParent";

const ComponentParent = () => {
  return (
    <div>
      <HeaderParent />
      <FormParent />
      <SpinnerParent />
    </div>
  );
};

export default ComponentParent;
