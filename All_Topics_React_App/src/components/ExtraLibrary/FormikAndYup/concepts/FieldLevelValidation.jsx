import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const FieldLevelValidation = () => {
  const validateField = (val) => {
    let error;
    if (!val) {
      error = "Required";
    }
    return error;
  };

  return (
    <Formik
      initialValues={{ name: "" }}
      onSubmit={(values) => {
        // Handle form submission here
        console.log("Form data", values);
      }}
    >
      {() => (
        <Form>
          <div>
            <label htmlFor="name">Name</label>
            <Field name="name" validate={validateField} />
            <ErrorMessage name="name" component="div" />
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default FieldLevelValidation;
