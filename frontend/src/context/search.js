import React, { useState, useContext, createContext } from "react";
// import { GiSeaTurtle } from "react-icons/gi";

const searchContext = createContext();
const SearchProvider = ({ children }) => {
    const [auth, setAuth] = useState({ keyword: "", results: [], });
    return (
        <searchContext.Provider value={[auth, setAuth]}>
            {children}
        </searchContext.Provider>
    );
};
//custom Hooks
const useSearch = () => useContext(searchContext);

export { useSearch, SearchProvider };
