import { useState } from "react"

export const useSessionStorage = (defaultValue) => {
    const [auth, setAuth] = useState(() => {
      try {
        const value = sessionStorage.getItem("token");
        if (value) {
          return JSON.parse(value);
        } else {
          return defaultValue;
        }
      } catch (err) {
        return defaultValue;
      }
    });
    const setToken = (newValue) => {
      try {
        sessionStorage.setItem("token", JSON.stringify(newValue));
      } catch (err) {
        console.log(err);
      }
      setAuth(newValue);
    };
    return [auth, setToken];
  };