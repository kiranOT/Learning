import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import OtpInput from "react-otp-input";
import * as Yup from "yup";

const schema = Yup.object().shape({
  otp: Yup.string().max(2),
});

const MyFormik = () => {
  return (
    <div>
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={schema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values, setFieldValue, handleBlur }) => (
          <Form>
            <OtpInput
              value={values.otp}
              onChange={(otp) => setFieldValue("otp", otp)}
              numInputs={4}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              onBlur={handleBlur}
            />
            <ErrorMessage component={"div"} name="otp" />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyFormik;
