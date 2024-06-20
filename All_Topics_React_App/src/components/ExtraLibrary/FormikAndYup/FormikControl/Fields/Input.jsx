import { Field, ErrorMessage } from "formik";
import React from "react";

const Input = (props) => {
  const { name, label, ...rest } = props;
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{label}</label>
      <Field name={name} {...rest} />
      <ErrorMessage name={name} />
    </div>
  );
};

export default Input;
