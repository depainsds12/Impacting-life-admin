import { cilEyedropper, cilLockLocked, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "src/assets/brand/logo.png"
import eyeClose from "src/assets/brand/eye-close.png"
import eyeOpen from "src/assets/brand/eye-open.png"
import { getAxios, getBaseURL } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"

const Login = () => {
  const url = `${getBaseURL()}/users/login/admin`
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validate, setValidate] = useState(false)

  const [toastFlag, setToastFlag] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("")

  const [loading, setLoading] = useState(false)

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false)

  const onLogin = async () => {
    if (!email || !password) {
      setValidate(true)
    } else {
      setLoading(true)
      try {
        const response = await getAxios().post(
          url,
          {
            username: email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        if (response?.status === 200) {
          localStorage.setItem("authToken", response?.data?.token)
          localStorage.setItem("userID", response?.data?.user?._id)
          navigate("/")
          window.location.reload()
        } else {
          setLoading(false)
          setToastFlag(true)
          setToastMessage("Invalid Credentials")
          setToastColor("warning")
          setTimeout(() => {
            setToastFlag(false)
          }, 2000)
        }
      } catch (error) {
        setLoading(false)
        setToastFlag(true)
        setToastMessage("API Error")
        setToastColor("danger")
        setTimeout(() => {
          setToastFlag(false)
        }, 2000)
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <CustomToast
        message={toastMessage}
        show={toastFlag}
        onClose={() => setToastFlag(false)}
        color={toastColor}
      />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6} style={{ textAlign: "center" }}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <div href="/">
                        <img src={logo} alt="Udharra-Logo" />
                      </div>
                      <p className="text-body-secondary">Sign In to your account</p>

                      <div className="mb-3" style={{ textAlign: "start" }}>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </CInputGroup>
                        {validate && !email ? (
                          <span style={{ color: "red", marginLeft: "45px" }}>
                            Email is required
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="mb-4" style={{ textAlign: "start" }}>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type={showPassword ? "text" : "password"} // Toggle input type
                            placeholder="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <CInputGroupText
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={showPassword ? eyeClose : eyeOpen} />
                            {/* Toggle eye icon */}
                          </CInputGroupText>
                        </CInputGroup>
                        {validate && !password ? (
                          <span style={{ color: "red", marginLeft: "45px" }}>
                            Password is required
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <CRow>
                        <CCol xs={12}>
                          <CButton
                            color="primary"
                            className="px-4"
                            onClick={onLogin}
                          >
                            {loading ? "Loading..." : "Login"}
                          </CButton>
                        </CCol>
                        <CCol xs={12} className="text-right">
                          <CButton
                            color="link"
                            className="px-0"
                            onClick={() => navigate("/forgotpassword")}
                          >
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
