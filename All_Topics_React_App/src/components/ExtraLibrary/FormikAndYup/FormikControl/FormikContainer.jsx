import React from "react";
import { Formik, Form } from "formik";
import FormikControl from "./FormikControl";

const FormikContainer = () => {
  const checkboxOptions = [
    { option: "first", value: "A" },
    { option: "second", value: "B" },
  ];
  return (
    <div>
      <Formik
        initialValues={{ Options: [], name: "" }}
        validate={(values) => {
          let error = {};
          if (!values.name) {
            error.name = "Required";
          }
          return error;
        }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values }) => (
          <>
            {console.log(values)}
            <Form>
              <FormikControl
                control="checkbox"
                name="Options"
                label="choose your favorite"
                options={checkboxOptions}
              />

              {/* <FormikControl control="input" name="name" label="name" /> */}
              <button type="submit">Submit</button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default FormikContainer;
