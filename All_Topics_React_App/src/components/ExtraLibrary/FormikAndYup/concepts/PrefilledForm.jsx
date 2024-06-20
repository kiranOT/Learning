import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";

const PrefilledForm = () => {
  const [fetchedData, setFecthData] = useState("");
  useEffect(() => {
    try {
      fetch("http://localhost:8080")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setFecthData(data);
        })
        .catch((er) => console.log(er));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const saveData = async (data) => {
    try {
      fetch("http://localhost:8080", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setFecthData(data);
        })
        .catch((er) => console.log(er));
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = { name: "", salary: 0 };
  return (
    <div>
      <Formik
        initialValues={fetchedData || initialValues}
        onSubmit={(values) => {
          console.log(values);
          saveData(values);
        }}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field name="name" />
            <Field name="salary" />
            <button type="submit"></button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PrefilledForm;
