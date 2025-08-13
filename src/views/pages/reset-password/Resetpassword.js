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
import axios from "axios"
import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import eyeClose from "src/assets/brand/eye-close.png"
import eyeOpen from "src/assets/brand/eye-open.png"
import logo from "src/assets/brand/logo.png"
import CustomToast from "../../../components/CustomToast/CustomToast"

const Resetpassword = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState("")

  // Get the location object
  const location = useLocation()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validate, setValidate] = useState(false)

  const [toastFlag, setToastFlag] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("")

  const [loading, setLoading] = useState(false)

  // Password visibility states for each password field
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tokenFromUrl = queryParams.get("token")

    setToken(tokenFromUrl)
  }, [location.search])

  const onChangePassword = async () => {
    const url = `https://udharaa.com/api/admin/resetPassword?token=${token}`

    if (!newPassword || !confirmPassword) {
      setValidate(true)
    } else if (newPassword !== confirmPassword) {
      setToastFlag(true)
      setToastMessage("Passwords do not match")
      setToastColor("warning")
      setValidate(true)
      setTimeout(() => {
        setToastFlag(false)
      }, 2000)
    } else {
      setLoading(true)
      try {
        const response = await axios.post(url, {
          password: newPassword,
          confirmPassword,
        })
        if (response?.data?.status === 200) {
          setLoading(false)
          setToastFlag(true)
          setToastMessage("Password Changed Successfully")
          setToastColor("success")
          localStorage.clear()
          window.location.href = "/login"
        } else {
          setLoading(false)
          setToastFlag(true)
          setToastMessage("Invalid Credentials")
          setToastColor("warning")
        }
      } catch (error) {
        console.log(error)

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

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
                      <p className="text-body-secondary fw-bold">Reset Password</p>

                      {/* New Password Field */}
                      <div className="mb-4" style={{ textAlign: "start" }}>
                        <CInputGroup>
                          <CFormInput
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => {
                              setValidate(false)
                              setNewPassword(e.target.value)
                            }}
                          />
                          <CInputGroupText
                            onClick={toggleNewPasswordVisibility}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={showNewPassword ? eyeClose : eyeOpen} />
                          </CInputGroupText>
                        </CInputGroup>
                        {validate && !newPassword ? (
                          <span style={{ color: "red" }}>New Password is required</span>
                        ) : null}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="mb-4" style={{ textAlign: "start" }}>
                        <CInputGroup>
                          <CFormInput
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value)
                              setValidate(false)
                            }}
                          />
                          <CInputGroupText
                            onClick={toggleConfirmPasswordVisibility}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={showConfirmPassword ? eyeClose : eyeOpen} />
                          </CInputGroupText>
                        </CInputGroup>
                        {validate && !confirmPassword ? (
                          <span style={{ color: "red" }}>Confirm Password is required</span>
                        ) : null}
                        {validate && confirmPassword !== newPassword ? (
                          <span style={{ color: "red" }}>
                            Confirm password is not matching with new password
                          </span>
                        ) : null}
                      </div>

                      <CRow>
                        <CCol xs={12}>
                          <CButton
                            color="primary"
                            className="px-4"
                            onClick={onChangePassword}
                          >
                            {loading ? "Changing..." : "Reset Password"}
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

export default Resetpassword
