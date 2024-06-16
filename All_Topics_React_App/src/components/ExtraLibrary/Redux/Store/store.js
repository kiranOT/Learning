import { createStoreHook } from "react-redux"


const Reducer = (state, action) => {
    switch (state.type) {
        case "inc":
            return state
    }
}

export const store = createStoreHook(Reducer)