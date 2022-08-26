import React, { useContext } from "react";

const StateContext = React.createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={React.useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
