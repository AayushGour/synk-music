import reducer from "./reducer"
import { initialState } from "./initialState"
import { createStore } from "redux"

let store = createStore(reducer, initialState)
export default store;