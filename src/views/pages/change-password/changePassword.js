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
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import eyeClose from "src/assets/brand/eye-close.png"
import eyeOpen from "src/assets/brand/eye-open.png"
import CustomToast from "../../../components/CustomToast/CustomToast"
import { getHeaders } from "../../../api/config"

const ChangePassword = () => {
  const navigate = useNavigate()

  const userID = localStorage.getItem("userID")

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validate, setValidate] = useState(false)

  const token = getHeaders().token

  const [toastFlag, setToastFlag] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("")

  const [loading, setLoading] = useState(false)

  // Password visibility states for each password field
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onChangePassword = async () => {
    const url = `https://udharaa.com/api/users/changeAdminPassword`

    if (!oldPassword || !newPassword || !confirmPassword) {
      setValidate(true)
    } else if (newPassword !== confirmPassword) {
      setToastFlag(true)
      setToastMessage("Passwords do not match")
      setToastColor("warning")
    } else {
      setLoading(true)
      try {
        const response = await axios.post(
          url,
          {
            userId: userID,
            oldPassword,
            newPassword,
            confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        )
        if (response?.data?.status === true) {
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

  // Toggles for each password visibility
  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword)
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
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-start">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6} style={{ textAlign: "center" }}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <p className="text-body-secondary fw-bold">Change Password</p>

                      {/* Old Password Field */}
                      <div className="mb-4" style={{ textAlign: "start" }}>
                        <CInputGroup>
                          <CFormInput
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                          <CInputGroupText
                            onClick={toggleOldPasswordVisibility}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={showOldPassword ? eyeClose : eyeOpen} />
                          </CInputGroupText>
                        </CInputGroup>
                        {validate && !oldPassword ? (
                          <span style={{ color: "red" }}>Old Password is required</span>
                        ) : null}
                      </div>

                      {/* New Password Field */}
                      <div className="mb-4" style={{ textAlign: "start" }}>
                        <CInputGroup>
                          <CFormInput
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                      </div>

                      <CRow>
                        <CCol xs={12}>
                          <CButton
                            color="primary"
                            className="px-4"
                            onClick={onChangePassword}
                          >
                            {loading ? "Changing..." : "Change Password"}
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

export default ChangePassword
