import { legacy_createStore as createStore } from "redux"

const initialState = {
  sidebarShow: true,
  theme: "light",
  loggedIn: false,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest }
    case "SET_LOGIN":
      return { ...state, loggedIn: rest.loggedIn }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
