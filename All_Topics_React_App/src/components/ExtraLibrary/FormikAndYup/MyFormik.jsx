import FormikAndYup from "./concepts/sample";
import FieldLevelValidation from "./concepts/FieldLevelValidation";
import FormikContainer from "./FormikControl/FormikContainer";
import PrefilledForm from "./concepts/PrefilledForm";
const MyFormik = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100">
      {/* <FormikAndYup /> */}
      {/* <FieldLevelValidation /> */}
      {/* <FormikContainer /> */}
      <PrefilledForm />
    </div>
  );
};

export default MyFormik;
