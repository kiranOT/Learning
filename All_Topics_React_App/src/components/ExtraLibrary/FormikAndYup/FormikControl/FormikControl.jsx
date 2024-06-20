import Checkbox from "./Fields/Checkbox";
import Input from "./Fields/Input";

const FormikControl = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "checkbox":
      return <Checkbox {...rest} />;
  }
};

export default FormikControl;
