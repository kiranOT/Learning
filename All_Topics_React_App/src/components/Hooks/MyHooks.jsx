import EffectMemoCallBack from "./UseEffect_useMemo_And_UseCallBack/EffectMemoCallBack"
import PasswordGenerator from "./UseEffect/PasswordGenerator/PasswordGenerator"
import Memo from "./memo/multipleComponent/Memo"
import StateHook from "./useStateConditon/StateHook"
import DarkOnOffNavi from './UseState/DarkOnOffNavi'
import UseContextHook from "./useContext/UseContextHook"
import UseRefHook from "./useRef/HookCombine"
import UseReducer from "./useReducer/UseReducer"
import UseLayoutEffect from "./useLayoutEffect/UseLayoutEffect"
const MyHooks = () => {
    let styles = {
        hr: { color: "red", width: "100vw", height: "0.1rem" }
    }
    return (
        <>
            {/* <DarkOnOffNavi /> */}

            {/* <StateHook />
            <hr style={styles.hr} /> */}
            
            {/* 
            <PasswordGenerator />
            <hr style={styles.hr} /> */}

            {/* <Memo />
            <hr style={styles.hr} /> */}

            {/* <UseRefHook />
            <hr style={styles.hr} /> */}

            {/* <UseContextHook />
            <hr style={styles.hr} /> */ }

            {/* <UseReducer />
            <hr style={styles.hr} /> */}

            {/* <UseLayoutEffect />
            <hr style={styles.hr} /> */}

            {/* <EffectMemoCallBack />
            <hr style={styles.hr} /> */}
        </>
    )
}

export default MyHooks