import React from "react";
import { Field, ErrorMessage } from "formik";

const Checkbox = (props) => {
  const { name, options, label, ...rest } = props;

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {options.map((option) => (
        <label key={option.key}>
          <Field type="checkbox" name={name} value={option.value} {...rest} />
          {option.key}
        </label>
      ))}
      <ErrorMessage name={name} />
    </div>
  );
};

export default Checkbox;
