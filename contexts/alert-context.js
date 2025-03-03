"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Alert from "@/components/ui/alert";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ message: "", type: "error" });

  const showAlert = useCallback((message, type = "error") => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert({ message: "", type: "error" });
    }, 2500);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};
