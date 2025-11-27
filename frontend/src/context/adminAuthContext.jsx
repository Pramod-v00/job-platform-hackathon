import { createContext, useState } from "react";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(
    localStorage.getItem("adminToken") ? true : false
  );

  const loginAdmin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdmin(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
