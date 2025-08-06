import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CRow,
    CSpinner,
} from "@coreui/react"
import React, { useEffect, useState } from "react"
import { getAxios, getBaseURL, getHeaders } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"

const Banner = () => {
    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [link, setLink] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false)
    const [toastFlag, setToastFlag] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [toastColor, setToastColor] = useState("")

    // Preview image on selection
    const handleImageChange = (event) => {
        const file = event.target.files[0]
        setImageFile(file)
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    // Fetch existing banner data (if editing)
    useEffect(() => {
        const url = `${getBaseURL()}/banner`
        const token = getHeaders().token
        const fetchData = async () => {
            try {
                const response = await getAxios().get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response?.data) {
                    setTitle(response.data?.title || "")
                    setSubtitle(response.data?.subtitle || "")
                    setLink(response.data?.link || "")
                    setDescription(response.data?.description || "")
                    if (response.data?.image) {
                        setImagePreview(response.data?.image)
                    }
                }
            } catch (err) {
                setToastFlag(true)
                setToastMessage("Error fetching banner details")
                setToastColor("danger")
                setTimeout(() => setToastFlag(false), 2000)
            }
        }
        fetchData()
    }, [])

    // Submit handler
    const onSubmit = async () => {
        setButtonLoading(true)
        const url = `${getBaseURL()}/banner`
        const token = getHeaders().token

        const formData = new FormData()
        formData.append("title", title)
        formData.append("subtitle", subtitle)
        formData.append("link", link)
        formData.append("description", description)
        if (imageFile) formData.append("image", imageFile)

        try {
            const response = await getAxios().put(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            if (response.status === 200) {
                setToastFlag(true)
                setToastMessage("Banner updated successfully")
                setToastColor("success")
                setTimeout(() => setToastFlag(false), 2000)
            } else {
                throw new Error()
            }
        } catch (error) {
            setToastFlag(true)
            setToastMessage("Error updating banner")
            setToastColor("danger")
            setTimeout(() => setToastFlag(false), 2000)
        } finally {
            setButtonLoading(false)
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
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Banner Details</strong>
                        </CCardHeader>
                        <CCardBody>
                            {/* Title */}
                            <div className="mb-3">
                                <CFormLabel className="fw-bold fs-7">Title</CFormLabel>
                                <CFormInput
                                    type="text"
                                    placeholder="Enter Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Subtitle */}
                            <div className="mb-3">
                                <CFormLabel className="fw-bold fs-7">Subtitle</CFormLabel>
                                <CFormInput
                                    type="text"
                                    placeholder="Enter Subtitle"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <CFormLabel className="fw-bold fs-7">Description</CFormLabel>
                                <CFormTextarea
                                    component="textarea"
                                    rows={5}
                                    placeholder="Enter Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Link */}
                            <div className="mb-3">
                                <CFormLabel className="fw-bold fs-7">Video Link</CFormLabel>
                                <CFormInput
                                    type="text"
                                    placeholder="Enter Video Link"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="mb-3">
                                <CFormLabel className="fw-bold fs-7">Image</CFormLabel>
                                <CFormInput
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            marginTop: "10px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}
                            </div>

                            {/* Submit Button */}
                            <div style={{ display: "flex", justifyContent: "end" }}>
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

export default Banner
