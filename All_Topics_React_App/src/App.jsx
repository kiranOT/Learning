import Applications from "./components/Applications/Applications"
import ExtraLibrary  from "./components/ExtraLibrary/ExtraLibrary"
import MyHooks from "./components/Hooks/MyHooks"
import Props from "./components/Props/Props"


export default function App() {
  return (
    <div className="flex justify-center flex-col">
      {/* <Props/> */}
      {/* <MyHooks/> */}
      <ExtraLibrary />
      {/* <Applications /> */}
    </div>
  )
}