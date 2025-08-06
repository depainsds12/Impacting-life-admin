import { CKEditor } from "@ckeditor/ckeditor5-react"
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document"

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
import React, { useEffect, useState } from "react"
import { getAxios, getBaseURL, getHeaders } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"

const TermsConditions = () => {
  const [Title, setTitle] = useState("")
  const [editorData, setEditorData] = useState("")
  const [buttonLoading, setButtonLoading] = useState(false)

  const [toastFlag, settoastFlag] = useState(false)
  const [toastMessage, settoastMessage] = useState("")
  const [toastColor, settoastColor] = useState("")

  useEffect(() => {
    const url = `${getBaseURL()}/admin/showTerm`
    const token = getHeaders().token
    const fetchData = async () => {
      try {
        const response = await getAxios().get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response)
        setTitle(response?.data?.data?.title)
        setEditorData(response?.data?.data?.message ? response?.data?.data?.message : "")
      } catch (err) {
        settoastFlag(true)
        settoastMessage("Error in Api")
        settoastColor("danger")
        setTimeout(() => {
          settoastFlag(false)
        }, 2000)
      }
    }

    fetchData()
  }, [])

  const onSubmit = async () => {
    setButtonLoading(true)

    const url = `${getBaseURL()}/admin/updateTerms`
    const token = getHeaders().token

    const payload = {
      title: Title,
      message: editorData,
    }
    try {
      const response = await getAxios().post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response)
      if (response.status === 200) {
        settoastFlag(true)
        settoastMessage("Submitted")
        settoastColor("success")
        setTimeout(() => {
          settoastFlag(false)
        }, 2000)
        setButtonLoading(false)
      } else {
        settoastFlag(true)
        settoastMessage("Error in Api")
        settoastColor("danger")
        setTimeout(() => {
          settoastFlag(false)
        }, 2000)
        setButtonLoading(false)
      }
    } catch (error) {
      settoastFlag(true)
      settoastMessage("Error in Api")
      settoastColor("danger")
      setTimeout(() => {
        settoastFlag(false)
      }, 2000)
      setButtonLoading(false)
    }
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
              <strong>Terms and Conditions</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1" className="fw-bold fs-7">
                  Title
                </CFormLabel>{" "}
                <CFormInput
                  type="text"
                  placeholder="Enter Title"
                  value={Title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1" className="fw-bold fs-7">
                  Description
                </CFormLabel>{" "}
                <div id="toolbar-container"></div>
                <CKEditor
                  editor={DecoupledEditor}
                  data={editorData}
                  onReady={(editor) => {
                    // Attach the toolbar to the desired location
                    const toolbarContainer = document.querySelector("#toolbar-container")
                    toolbarContainer.appendChild(editor.ui.view.toolbar.element)
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setEditorData(data)
                  }}
                  config={{
                    heading: {
                      options: [
                        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                        {
                          model: "heading1",
                          view: "h1",
                          title: "Heading 1",
                          class: "ck-heading_heading1",
                        },
                        {
                          model: "heading2",
                          view: "h2",
                          title: "Heading 2",
                          class: "ck-heading_heading2",
                        },
                        {
                          model: "heading3",
                          view: "h3",
                          title: "Heading 3",
                          class: "ck-heading_heading3",
                        },
                      ],
                    },
                  }}
                />
              </div>
              <div className="mb-3" style={{ display: "flex", justifyContent: "end" }}>
                <CButton
                  style={{ backgroundColor: "#50C878" }}
                  onClick={onSubmit}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? (
                    <>
                      <CSpinner as="span" size="sm" variant="grow" aria-hidden="true" />
                      Loading...
                    </>
                  ) : (
                    "Submit"
                  )}
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default TermsConditions
