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
import logo from "src/assets/brand/logo.svg"
import eyeClose from "src/assets/brand/eye-close.png"
import eyeOpen from "src/assets/brand/eye-open.png"
import { getAxios, getBaseURL } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"

const Forgotpassword = () => {
  const url = `${getBaseURL()}/admin/forgotPassword`
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [validate, setValidate] = useState(false)

  const [toastFlag, setToastFlag] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("")

  const [loading, setLoading] = useState(false)

  const onLogin = async () => {
    if (!email) {
      setValidate(true)
    } else {
      setLoading(true)
      try {
        const response = await getAxios().post(
          url,
          {
            email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        if (response?.data?.status === 200) {
          setLoading(false)
          setToastFlag(true)
          setToastMessage(response?.data?.message)
          setToastColor("success")
          setTimeout(() => {
            setToastFlag(false)
          }, 2000)
        } else {
          setLoading(false)
          setToastFlag(true)
          setToastMessage(response?.data?.message)
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
                      <p className="text-body-secondary fw-bold">Forgot Password</p>

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

                      <CRow>
                        <CCol xs={12}>
                          <CButton
                            style={{ backgroundColor: "#50C878" }}
                            className="px-4"
                            onClick={onLogin}
                          >
                            {loading ? "Sending..." : "Sent"}
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

export default Forgotpassword
