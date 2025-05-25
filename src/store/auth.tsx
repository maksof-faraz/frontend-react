import { createContext, useEffect, useState } from "react";
import type { AuthContextType, ChildrenProps, userInfo } from "../types/userTypes";
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext<AuthContextType>({
  setTokenInLS: () => { },
  user: { userId: '', email: '', userName: '' }
});

export const AuthProvider = ({ children }: ChildrenProps) => {

  const [user, setUser] = useState<userInfo>({ userId: '', email: '', userName: '' });

  const setUserInfo = (token : string) => {
    const decodedUser: userInfo = jwtDecode(token);
    setUser(decodedUser)
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUserInfo(token) 
  }, [])

  const setTokenInLS = (token: string) => {
    localStorage.setItem('token', token)
    setUserInfo(token)
  }

  return <AuthContext.Provider value={{ setTokenInLS, user }}>{children}</AuthContext.Provider>

}