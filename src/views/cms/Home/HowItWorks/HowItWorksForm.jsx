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
  CImage,
  CFormTextarea,
} from "@coreui/react"
import React, { useState, useEffect } from "react"
import { getAxios, getBaseURL, getHeaders } from "../../../../api/config"
import CustomToast from "../../../../components/CustomToast/CustomToast"
import { useNavigate, useLocation } from "react-router-dom"

const HowItWorksForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const itemId = location.state?.id || null

  const [buttonLoading, setButtonLoading] = useState(false)
  const [toastFlag, setToastFlag] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("")

  const [item, setItem] = useState({
    title: "",
    description: "",
    image: "",
    imageFile: null,
  })

  // Fetch entry if editing
  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        const url = `${getBaseURL()}/how-it-works/${itemId}`
        const token = getHeaders().token
        try {
          const response = await getAxios().get(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setItem({
            title: response?.data?.title || "",
            description: response?.data?.description || "",
            image: response?.data?.image || "",
            imageFile: null,
          })
        } catch (error) {
          setToastFlag(true)
          setToastMessage("Error fetching details")
          setToastColor("danger")
          setTimeout(() => setToastFlag(false), 2000)
        }
      }
      fetchItem()
    }
  }, [itemId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setItem((prev) => ({
      ...prev,
      imageFile: file,
    }))
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setItem((prev) => ({ ...prev, image: ev.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async () => {
    setButtonLoading(true)
    const token = getHeaders().token

    if (!item.title || !item.description || (!item.image && !item.imageFile)) {
      setToastFlag(true)
      setToastMessage("Please fill all fields and upload an image")
      setToastColor("warning")
      setTimeout(() => setToastFlag(false), 2000)
      setButtonLoading(false)
      return
    }

    try {
      const url = itemId ? `${getBaseURL()}/how-it-works/${itemId}` : `${getBaseURL()}/how-it-works`
      const method = itemId ? "put" : "post"
      const formData = new FormData()
      formData.append("title", item.title)
      formData.append("description", item.description)
      if (item.imageFile) formData.append("image", item.imageFile)
      // If editing and no new image, backend should keep old image

      const response = await getAxios()[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200 || response.status === 201) {
        setToastFlag(true)
        setToastMessage(itemId ? "Entry Updated Successfully" : "Entry Submitted Successfully")
        setToastColor("success")
        setItem({ title: "", description: "", image: "", imageFile: null })
        setTimeout(() => navigate("/how-it-works-cms"), 3000)
      } else {
        throw new Error("Unexpected response")
      }
    } catch (error) {
      setToastFlag(true)
      setToastMessage("Error saving entry")
      setToastColor("danger")
    }
    setTimeout(() => setToastFlag(false), 2000)
    setButtonLoading(false)
  }

  return (
    <>
      <CustomToast
        message={toastMessage}
        show={toastFlag}
        onClose={() => setToastFlag(false)}
        color={toastColor}
      />

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{itemId ? "Edit How It Works" : "Create How It Works"}</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Title</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  value={item.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Description</CFormLabel>
                <CFormTextarea
                  component="textarea"
                  rows={5}
                  placeholder="Enter Description"
                  value={item.description}
                  name="description"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Image</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {item.image && (
                  <CImage
                    src={item.image}
                    alt="Preview"
                    style={{ width: "200px", height: "200px", marginTop: "10px", objectFit: "cover" }}
                  />
                )}
              </div>
              <CButton
                style={{ backgroundColor: "#50C878" }}
                onClick={onSubmit}
                disabled={buttonLoading}
              >
                {buttonLoading ? <CSpinner size="sm" /> : itemId ? "Update" : "Submit"}
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default HowItWorksForm