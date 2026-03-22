import { createContext, useReducer, useEffect } from "react";
import { getCurrentUser } from "../api/auth.api";

export const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { user: null, loading: false };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchUser = async () => {
  try {
    const data = await getCurrentUser(); // already returns res.data
    dispatch({ type: "SET_USER", payload: data });
  } catch {
    dispatch({ type: "LOGOUT" });
  }
};

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;