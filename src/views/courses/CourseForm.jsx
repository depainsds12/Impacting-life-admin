import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CRow,
    CCol,
    CSpinner,
    CFormTextarea,
    CImage
} from "@coreui/react";
import { getAxios, getBaseURL, getHeaders } from "../../api/config";
import { useLocation, useNavigate } from "react-router-dom";
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "../../utils/constants";
import CustomToast from "../../components/CustomToast/CustomToast";

const CreateCourseForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        rating: "",
        reviewsCount: "",
        learnersCount: "",
        categories: "",
        badge: "",
        skillLevel: "",
        trainingType: "",
        image1: null,
        image2: null,
    });

    const navigate = useNavigate()
    const location = useLocation()
    const itemId = location.state?.id || null

    const [preview1, setPreview1] = useState(null);
    const [preview2, setPreview2] = useState(null);
    const [badges, setBadges] = useState([]);
    const [categories, setCategories] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false)
    const [toastFlag, setToastFlag] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [toastColor, setToastColor] = useState("")

    console.log("formData", formData)

    useEffect(() => {
        if (itemId) {
            const fetchItem = async () => {
                const url = `${getBaseURL()}/course/view/${itemId}`
                const token = getHeaders().token
                try {
                    const response = await getAxios().get(url, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (response.status == 200) {
                        setFormData({
                            name: response?.data?.name || "",
                            description: response?.data?.description || "",
                            rating: response?.data?.rating || "",
                            reviewsCount: response?.data?.reviewsCount || "",
                            learnersCount: response?.data?.learnersCount || "",
                            categories: response?.data?.categories ? response?.data?.categories?.map(a => a?._id)[0] : "",
                            badge: response?.data?.badge?._id || "",
                            skillLevel: response?.data?.skillLevel || "",
                            trainingType: response?.data?.trainingType || "",
                            image1: null,
                            image2: null,
                        })
                        setPreview1(response?.data?.image || null);
                        setPreview2(response?.data?.detailsImage || null);
                    }
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

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        const token = getHeaders().token;
        const res = await getAxios().get(`${getBaseURL()}/course/badges`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBadges(res.data || []);

        const res1 = await getAxios().get(`${getBaseURL()}/course/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res1.data || []);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e, field, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [field]: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.description || !formData.categories || !formData.badge || !formData.image1 || !formData.image2) {
            setToastFlag(true);
            setToastMessage("Please fill all fields");
            setToastColor("warning");
            setTimeout(() => setToastFlag(false), 2000);
            setButtonLoading(false);
            return;
        }

        if ((formData.image1 && formData.image1.size > MAX_IMAGE_SIZE_BYTES) || (formData.image2 && formData.image2.size > MAX_IMAGE_SIZE_BYTES)) {
            setToastFlag(true);
            setToastMessage(`Image size should not exceed ${MAX_IMAGE_SIZE_MB} MB`);
            setToastColor("warning");
            setTimeout(() => setToastFlag(false), 2000);
            return;
        }

        setButtonLoading(true)

        try {
            const sendData = new FormData();
            sendData.append("name", formData.name);
            sendData.append("description", formData.description);
            sendData.append("rating", formData.rating);
            sendData.append("reviewsCount", formData.reviewsCount);
            sendData.append("learnersCount", formData.learnersCount);
            sendData.append("categories", formData.categories);
            sendData.append("badge", formData.badge);
            sendData.append("skillLevel", formData.skillLevel);
            sendData.append("trainingType", formData.trainingType);
            sendData.append("image", formData.image1);
            sendData.append("detailsImage", formData.image2);

            const url = itemId
                ? `${getBaseURL()}/course/update/${itemId}`
                : `${getBaseURL()}/course/create`;
            const method = itemId ? "put" : "post";
            const token = getHeaders().token

            const response = await getAxios()[method](url, sendData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200 || response.status === 201) {
                setToastFlag(true);
                setToastMessage(itemId ? "Entry Updated Successfully" : "Entry Submitted Successfully");
                setToastColor("success");
                setFormData({
                    name: "",
                    description: "",
                    rating: "",
                    reviewsCount: "",
                    learnersCount: "",
                    categories: "",
                    badge: "",
                    skillLevel: "",
                    trainingType: "",
                    image1: null,
                    image2: null,
                });
                setPreview1(null);
                setPreview2(null);
                setTimeout(() => navigate("/course-list"), 3000);
            } else {
                throw new Error("Unexpected response");
            }
        } catch (error) {
            setToastFlag(true);
            setToastMessage(error?.response?.data?.message || error?.message || "Error saving entry");
            setToastColor("danger");
        }

        setTimeout(() => setToastFlag(false), 2000);
        setButtonLoading(false);
    };

    return (
        <CCard>
            <CustomToast
                message={toastMessage}
                show={toastFlag}
                onClose={() => setToastFlag(false)}
                color={toastColor}
            />
            <CCardHeader style={{justifyContent: 'space-between', display:'flex', alignItems: 'center'}}>
                <strong>{itemId ? "Edit" : "Create"} Course</strong>
                <CButton color="primary">
                    Add Learning Method
                </CButton>
            </CCardHeader>
            <CCardBody>
                <CForm onSubmit={handleSubmit}>
                    <CRow>
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                label="Course Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                label="Rating"
                                name="rating"
                                type="number"
                                step="0.1"
                                value={formData.rating}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                label="Reviews Count"
                                name="reviewsCount"
                                type="number"
                                value={formData.reviewsCount}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                label="Learners Count"
                                name="learnersCount"
                                type="number"
                                value={formData.learnersCount}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <CFormTextarea
                                label="Description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormSelect
                                label="Category"
                                name="categories"
                                value={formData.categories}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {
                                    categories?.map((c, i) =>
                                        <option value={c?._id} key={i}>{c?.name}</option>
                                    )
                                }
                            </CFormSelect>
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormSelect
                                label="Badge"
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Badge</option>
                                {
                                    badges?.map((b, i) =>
                                        <option value={b?._id} key={i}>{b?.name}</option>
                                    )
                                }
                            </CFormSelect>
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormSelect
                                label="Skill Level"
                                name="skillLevel"
                                value={formData.skillLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Skill Level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormSelect
                                label="Training Type"
                                name="trainingType"
                                value={formData.trainingType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Training Type</option>
                                <option value="course_only">Course Only</option>
                                <option value="exam_booking_and_prep_only">Exam Booking & Prep Only</option>
                                <option value="bootcamp_only">Bootcamp Only</option>
                                <option value="Bundle">Bundle (Course + Exam + Bootcamp)</option>
                            </CFormSelect>
                        </CCol>

                        {/* Image 1 */}
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                type="file"
                                accept="image/*"
                                label="Main Course Image"
                                onChange={(e) => handleImageChange(e, "image1", setPreview1)}
                                required
                            />
                            {preview1 && (
                                <CImage
                                    src={preview1}
                                    alt="Main Course Image"
                                    style={{ width: "200px", marginTop: "10px", objectFit: "cover" }}
                                />
                            )}
                        </CCol>

                        {/* Image 2 */}
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                type="file"
                                accept="image/*"
                                label="Course Detail Page Image"
                                onChange={(e) => handleImageChange(e, "image2", setPreview2)}
                                required
                            />
                            {preview2 && (
                                <CImage
                                    src={preview2}
                                    alt="Course Detail Page Image"
                                    style={{ width: "200px", marginTop: "10px", objectFit: "cover" }}
                                />
                            )}
                        </CCol>
                    </CRow>

                    <CButton color="primary" type="submit" disabled={buttonLoading}>
                        {buttonLoading ? <CSpinner size="sm" /> : itemId ? "Edit Course" : "Create Course"}
                    </CButton>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default CreateCourseForm;
