import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const MyProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    var savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <AppContext.Provider value={{ auth, setAuth }}>
      {children}
    </AppContext.Provider>
  );
};
