import { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "./useSessionStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setToken] = useSessionStorage(null);
    const navigate = useNavigate();

    const login = useCallback((data, pagePath) => {
        setToken(data)
        navigate(pagePath)
    }, [navigate, setToken])

    const logout = useCallback(() => {
        try{
            sessionStorage.removeItem("token")
        }catch(error){
            console.log(error)
        }
        navigate("/", { replace: true });
    }, [navigate])

    const value = useMemo(
        () => ({
        auth,
        setToken,
        login,
        logout
        }),
        [auth, setToken, login, logout]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

export const useAuth = () => {
  return useContext(AuthContext);
};