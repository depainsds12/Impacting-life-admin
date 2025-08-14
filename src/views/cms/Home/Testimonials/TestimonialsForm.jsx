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
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "../../../../utils/constants"

const TestimonialsForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const itemId = location.state?.id || null

  const [buttonLoading, setButtonLoading] = useState(false)
  const [toastFlag, setToastFlag] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("")

  const [item, setItem] = useState({
    name: "",
    designation: "",
    ratings: "",
    experience: "",
    description: "",
    image: "",
    imageFile: null,
  })

  // Fetch entry if editing
  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        const url = `${getBaseURL()}/cms/testimonials/${itemId}`
        const token = getHeaders().token
        try {
          const response = await getAxios().get(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setItem({
            name: response?.data?.name || "",
            designation: response?.data?.designation || "",
            ratings: response?.data?.ratings || "",
            experience: response?.data?.experience || "",
            description: response?.data?.description || "",
            image: response?.data?.image || "",
            imageFile: null,
          })
        } catch (error) {
          setToastFlag(true)
          setToastMessage("Error fetching testimonial details")
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
    setButtonLoading(true);
    const token = getHeaders().token;
  
    // Empty field validation
    if (
      !item.name ||
      !item.designation ||
      !item.ratings ||
      !item.experience ||
      !item.description ||
      (!item.image && !item.imageFile)
    ) {
      setToastFlag(true);
      setToastMessage("Please fill all fields");
      setToastColor("warning");
      setTimeout(() => setToastFlag(false), 2000);
      setButtonLoading(false);
      return;
    }
  
    // Image size validation
    if (item.imageFile && item.imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      setToastFlag(true);
      setToastMessage(`Image size should not exceed ${MAX_IMAGE_SIZE_MB} MB`);
      setToastColor("warning");
      setTimeout(() => setToastFlag(false), 2000);
      setButtonLoading(false);
      return;
    }
  
    try {
      const url = itemId
        ? `${getBaseURL()}/cms/testimonials/${itemId}`
        : `${getBaseURL()}/cms/testimonials`;
      const method = itemId ? "put" : "post";
  
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("designation", item.designation);
      formData.append("ratings", item.ratings);
      formData.append("experience", item.experience);
      formData.append("description", item.description);
      if (item.imageFile) formData.append("image", item.imageFile);
  
      const response = await getAxios()[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        setToastFlag(true);
        setToastMessage(itemId ? "Testimonial Updated Successfully" : "Testimonial Added Successfully");
        setToastColor("success");
        setItem({
          name: "",
          designation: "",
          ratings: "",
          experience: "",
          description: "",
          image: "",
          imageFile: null,
        });
        setTimeout(() => navigate("/testimonial-cms"), 3000);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      setToastFlag(true);
      setToastMessage(error?.response?.data?.message || error?.message || "Error saving testimonial");
      setToastColor("danger");
    }
  
    setTimeout(() => setToastFlag(false), 2000);
    setButtonLoading(false);
  };

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
              <strong>{itemId ? "Edit Testimonial" : "Create Testimonial"}</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Name</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={item.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Designation</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Enter Designation"
                  name="designation"
                  value={item.designation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Ratings</CFormLabel>
                <CFormInput
                  type="number"
                  placeholder="Enter Ratings (e.g. 4.5)"
                  name="ratings"
                  value={item.ratings}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Experience</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Enter Experience"
                  name="experience"
                  value={item.experience}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel className="fw-bold fs-7">Description</CFormLabel>
                <CFormTextarea
                  rows={5}
                  placeholder="Enter Description"
                  name="description"
                  value={item.description}
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
                    style={{
                      width: "200px",
                      height: "200px",
                      marginTop: "10px",
                      objectFit: "cover"
                    }}
                  />
                )}
              </div>
              <CButton
                color="primary"
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

export default TestimonialsForm
