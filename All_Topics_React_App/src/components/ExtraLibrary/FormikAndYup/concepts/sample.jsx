import { useFormik } from "formik";
import * as Yup from "yup";

export default function MyFormik() {
  const validateSchema = Yup.object({
    name: Yup.string().min(2).max(20).required("Name must be entered"),
    email: Yup.string().email().required("please provide Email"),
    password: Yup.string().min(8).max(16).required("Please enter password"),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref("password"), null], "Password must be same"),
  });

  let initialValues = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: validateSchema,
      onSubmit: (values, action) => {
        console.log(values);
        action.resetForm();
      },
    });

  console.log(errors);

  return (
    <>
      <form className="ml-5" onSubmit={handleSubmit}>
        <br />
        <label htmlFor="name">Name</label>
        <br />
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="off"
          placeholder="Enter your Name"
        />
        <p>{touched.name && errors.name ? errors.name : null}</p>
        <br />

        <br />
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="off"
          placeholder="Enter Email"
        />
        <p>{touched.email && errors.email ? errors.email : null}</p>

        <br />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="text"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="off"
          placeholder="Enter Password"
        />
        <p>{touched.password && errors.password ? errors.password : null}</p>
        <br />
        <br />
        <label htmlFor="name">confirm_password</label>
        <br />
        <input
          type="text"
          name="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="off"
          placeholder="Enter confirm password "
        />
        <p>
          {touched.confirm_password && errors.confirm_password
            ? errors.confirm_password
            : null}
        </p>

        <br />
        <button className="bg-blue-200 rounded-lg p-1 m-2" type="submit">
          submit
        </button>
      </form>
    </>
  );
}
