import { createContext, useContext, useReducer } from "react";

const ProjectContext = createContext();

const initialState = { projects: [], currentProject: null, loading: false };
const reducer = (state, action) => {
  switch(action.type){
    case "SET_PROJECTS": return { ...state, projects: action.payload };
    case "SET_CURRENT": return { ...state, currentProject: action.payload };
    default: return state;
  }
};

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <ProjectContext.Provider value={{ state, dispatch }}>{children}</ProjectContext.Provider>;
};

export const useProject = () => useContext(ProjectContext);