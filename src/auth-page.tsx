import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./auth.css"
import MainPage from "./main-page";
import RequestPage from "./request-page";
import TablesPage from "./tables-page";
import User from "./types/User";

enum AccessStatus {
  Success = "success",
  Error = "error",
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<MainPage />}>
          <Route path="/tables" element={
            <RequiredAuth>
              <TablesPage />
            </RequiredAuth>
          } />
          <Route path="/request" element={
            <RequiredAuth>
              <RequestPage />
            </RequiredAuth>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

interface AuthContextType {
  user: User | undefined;
  signin: (user: User) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<User>(JSON.parse(localStorage.getItem("account")!))

  let signin = (newUser: User) => {
    setUser(newUser)
    localStorage.setItem("account", JSON.stringify(newUser))
  }

  let value = { user, signin }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  return React.useContext(AuthContext)
}

function RequiredAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth()
  let location = useLocation()

  if (!auth.user)
    return <Navigate to={"/auth"} state={{ from: location }} replace />

  return children
}

function AuthPage() {
  const auth = useAuth()
  let location = useLocation();
  const navigate = useNavigate()
  const authMenu = useRef<HTMLDivElement>(null)
  const [login, setLogin] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  let from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (auth.user) {
      navigate(from, { replace: true })
    }
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (login !== "admin" || password !== "admin") {
      setMenuStatus(AccessStatus.Error)
      return
    }

    const user: User = { Login: login, Password: password }

    auth.signin(user)
    setMenuStatus(AccessStatus.Success, () => { navigate(from, { replace: true }) })
  }

  const setMenuStatus = (status: AccessStatus, callback: VoidFunction = () => { }) => {
    if (authMenu.current) {
      authMenu.current.classList.add("auth-" + status)
      setTimeout(() => {
        authMenu.current!.classList.remove("auth-" + status)
        callback()
      }, 800);
    }
  }

  return (
    <div id="auth">
      <div className='auth-menu' ref={authMenu}>
        <h1 className='auth-label'>Авторизация</h1>
        <div className='auth-form'>
          <input id="auth-login" placeholder='Логин' onChange={(e) => setLogin(e.target.value)} value={login} />
          <input id="auth-password" type={'password'} onChange={(e) => setPassword(e.target.value)} placeholder='Пароль' value={password} />
          <button id="auth-button" onClick={handleClick}>Вход</button>
        </div>
      </div>
    </div>
  )
}