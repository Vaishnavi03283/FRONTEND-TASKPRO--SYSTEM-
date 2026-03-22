import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();
const initialState = { users: [], currentUser: null, loading: false };
const reducer = (state, action) => {
  switch(action.type){
    case "SET_USERS": return { ...state, users: action.payload };
    case "SET_CURRENT": return { ...state, currentUser: action.payload };
    default: return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export const useUsers = () => useContext(UserContext);