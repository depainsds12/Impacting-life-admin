import React, { Suspense, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom"

import { CSpinner, useColorModes } from "@coreui/react"
import "./scss/style.scss"

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"))

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"))
const ForgotPassword = React.lazy(() => import("./views/pages/forgotpassword/Forgotpassword"))
const ResetPassword = React.lazy(() => import("./views/pages/reset-password/Resetpassword"))
const Register = React.lazy(() => import("./views/pages/register/Register"))
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"))
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"))

const App = () => {
  const [loggedIn, setloggedIn] = useState(localStorage.getItem("authToken"))
  const { isColorModeSet, setColorMode } = useColorModes("coreui-free-react-admin-template-theme")
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split("?")[1])
    const theme = urlParams.get("theme") && urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact index path="/login" name="Login Page" element={<Login />} />
          <Route path="/forgotpassword" name="Forgot Page" element={<ForgotPassword />} />
          <Route path="/resetpassword" name="Reset Page" element={<ResetPassword />} />
          <Route
            path="*"
            name="Home"
            element={loggedIn === null ? <Navigate to="/login" /> : <DefaultLayout />}
          />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
