import MyFormik from "./FormikAndYup/MyFormik";
import Redux from "./Redux/Redux";
import UsableCompo from "./UsableCompo/UsableCompo";
import Loading from "./Loading/Loading";

export default function ExtraLibrary() {
  return (
    <div className="bg-red-500">
      <MyFormik />
      {/* <Redux/> */}
      {/* <UsableCompo /> */}
      {/* <Loading /> */}
    </div>
  );
}
