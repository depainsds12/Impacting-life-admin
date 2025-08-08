import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from "@coreui/react"
import React, { useState, useEffect } from "react"
import { getAxios, getBaseURL, getHeaders } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"
import { useNavigate, useLocation } from "react-router-dom"

const FAQs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const faqId = location.state?.id || null

  const [buttonLoading, setButtonLoading] = useState(false)
  const [toastFlag, settoastFlag] = useState(false)
  const [toastMessage, settoastMessage] = useState("")
  const [toastColor, settoastColor] = useState("")

  const [faq, setFaq] = useState({
    question: "",
    answer: "",
  })

  // Fetch FAQ if editing
  useEffect(() => {
    if (faqId) {
      const fetchFAQ = async () => {
        const url = `${getBaseURL()}/cms/faqs/${faqId}`
        const token = getHeaders().token
        try {
          const response = await getAxios().get(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setFaq({
            question: response?.data?.question || "",
            answer: response?.data?.answer || "",
          })
        } catch (error) {
          settoastFlag(true)
          settoastMessage("Error fetching FAQ details")
          settoastColor("danger")
          setTimeout(() => settoastFlag(false), 2000)
        }
      }
      fetchFAQ()
    }
  }, [faqId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFaq((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = async () => {
    setButtonLoading(true)
    const token = getHeaders().token

    if (!faq.question || !faq.answer) {
      settoastFlag(true)
      settoastMessage("Please fill both fields")
      settoastColor("warning")
      setTimeout(() => settoastFlag(false), 2000)
      setButtonLoading(false)
      return
    }

    try {
      const url = faqId ? `${getBaseURL()}/cms/faqs/${faqId}` : `${getBaseURL()}/cms/faqs`
      const method = faqId ? "put" : "post"

      const response = await getAxios()[method](url, faq, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200 || response.status === 201) {
        settoastFlag(true)
        settoastMessage(faqId ? "FAQ Updated Successfully" : "FAQ Submitted Successfully")
        settoastColor("success")
        setFaq({ question: "", answer: "" })
        setTimeout(() => navigate("/faqs"), 1500)
      } else {
        throw new Error("Unexpected response")
      }
    } catch (error) {
      settoastFlag(true)
      settoastMessage("Error saving FAQ")
      settoastColor("danger")
    }
    setTimeout(() => settoastFlag(false), 2000)
    setButtonLoading(false)
  }

  return (
    <>
      <CustomToast
        message={toastMessage}
        show={toastFlag}
        onClose={() => settoastFlag(false)}
        color={toastColor}
      />

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{faqId ? "Edit FAQ" : "Create FAQ"}</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Question</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Enter Question"
                  name="question"
                  value={faq.question}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Answer</CFormLabel>
                <div id="toolbar-container1"></div>
                <CKEditor
                  editor={DecoupledEditor}
                  data={faq.answer}
                  onReady={(editor) => {
                    const toolbarContainer = document.querySelector("#toolbar-container1")
                    if (toolbarContainer && editor.ui.view.toolbar.element) {
                      toolbarContainer.innerHTML = "" // clear old toolbar
                      toolbarContainer.appendChild(editor.ui.view.toolbar.element)
                    }
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setFaq((prev) => ({
                      ...prev,
                      answer: data,
                    }))
                  }}
                />
              </div>

              <CButton
                style={{ backgroundColor: "#50C878" }}
                onClick={onSubmit}
                disabled={buttonLoading}
              >
                {buttonLoading ? <CSpinner size="sm" /> : faqId ? "Update FAQ" : "Submit FAQ"}
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default FAQs
