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
    CFormCheck
} from "@coreui/react";
import { getAxios, getBaseURL, getHeaders } from "../../api/config";
import { useLocation, useNavigate } from "react-router-dom";
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "../../utils/constants";
import CustomToast from "../../components/CustomToast/CustomToast";
import del from "../../assets/brand/delete.png";


const LearningMethod = () => {
    const location = useLocation()
    const itemId = location.state?.id || null

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        newPrice: "",
        vatIncluded: true,
        duration: "",
        durationHours: "",
        weeks: "",
        code: "",
        techType: "",
        whatsIncluded: "",
        description: "",
        whatYouWillLearn: [],
        includes: [],
        schedules: [],
        overview: {
            description: "",
            targetAudience: [],
            prerequisites: [],
            benefits: []
        },
        courseContent: [{
            moduleTitle: "",
            moduleDescription: "",
            preview: ""
        }],
        relatedCourses: [],
        course_id: location.state?.course_id || null
    });

    const navigate = useNavigate()

    const [learningMethods, setLearningMethods] = useState([]);
    const [includeIcons, setIncludeIcons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false)
    const [toastFlag, setToastFlag] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [toastColor, setToastColor] = useState("")

    useEffect(() => {
        if (itemId) {
            const fetchItem = async () => {
                const url = `${getBaseURL()}/course/learning-method/${itemId}`
                const token = getHeaders().token
                try {
                    const response = await getAxios().post(url, { course_id: location.state?.course_id }, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (response.status == 200) {
                        let data = response?.data
                        setFormData({
                            ...formData,
                            name: data?.name || "",
                            price: data?.price || "",
                            newPrice: data?.newPrice || "",
                            vatIncluded: data?.vatIncluded ? true : false,
                            duration: data?.duration || "",
                            durationHours: data?.durationHours || "",
                            weeks: data?.weeks || "",
                            code: data?.code || "",
                            techType: data?.techType || "",
                            whatsIncluded: data?.whatsIncluded || "",
                            description: data?.description || "",
                            whatYouWillLearn: data?.whatYouWillLearn || [],
                            includes: data?.includes || [],
                            schedules: data?.schedules?.map(a => ({ ...a, startDate: a.startDate ? a.startDate.split("T")[0] : "" })) || [],
                            overview: data?.overview || {
                                description: "",
                                targetAudience: [],
                                prerequisites: [],
                                benefits: []
                            },
                            courseContent: data?.courseContent || [{
                                moduleTitle: "",
                                moduleDescription: "",
                                preview: ""
                            }]
                        })
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

    const showToast = (message, color = "info", duration = 2000) => {
        setToastMessage(message);
        setToastColor(color);
        setToastFlag(true);
        setTimeout(() => setToastFlag(false), duration);
    };

    const fetchData = async () => {
        const token = getHeaders().token;

        const res = await getAxios().get(`${getBaseURL()}/course/includes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setIncludeIcons(res.data || []);

        const res1 = await getAxios().get(`${getBaseURL()}/course/formats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setLearningMethods(res1.data || []);

        const res2 = await getAxios().get(`${getBaseURL()}/course/dropdown`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res2.data?.data || []);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddLearningPoint = () => {
        setFormData({
            ...formData,
            whatYouWillLearn: [...formData.whatYouWillLearn, ""]
        });
    };

    const handleLearningPointChange = (index, value) => {
        const updatedList = [...formData.whatYouWillLearn];
        updatedList[index] = value;
        setFormData({
            ...formData,
            whatYouWillLearn: updatedList
        });
    };

    const handleRemoveLearningPoint = (index) => {
        const updatedList = formData.whatYouWillLearn.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            whatYouWillLearn: updatedList
        });
    };

    const handleAddInclude = () => {
        setFormData({
            ...formData,
            includes: [...formData.includes, { icon: "", description: "" }]
        });
    };

    const handleIncludeChange = (index, field, value) => {
        const updated = [...formData.includes];
        updated[index][field] = value;
        setFormData({ ...formData, includes: updated });
    };

    const handleRemoveInclude = (index) => {
        const updated = formData.includes.filter((_, i) => i !== index);
        setFormData({ ...formData, includes: updated });
    };

    const handleAddSchedule = () => {
        setFormData({
            ...formData,
            schedules: [...formData.schedules, { type: itemId, startDate: "", spaces: "" }]
        });
    };

    const handleScheduleChange = (index, field, value) => {
        const updated = [...formData.schedules];
        updated[index][field] = value;
        setFormData({ ...formData, schedules: updated });
    };

    const handleRemoveSchedule = (index) => {
        const updated = formData.schedules.filter((_, i) => i !== index);
        setFormData({ ...formData, schedules: updated });
    };

    const handleOverviewChange = (field, value) => {
        setFormData({
            ...formData,
            overview: {
                ...formData.overview,
                [field]: value
            }
        });
    };

    const handleAddOverviewItem = (field) => {
        setFormData({
            ...formData,
            overview: {
                ...formData.overview,
                [field]: [...formData.overview[field], ""]
            }
        });
    };

    const handleOverviewItemChange = (field, index, value) => {
        const updated = [...formData.overview[field]];
        updated[index] = value;
        setFormData({
            ...formData,
            overview: {
                ...formData.overview,
                [field]: updated
            }
        });
    };

    const handleRemoveOverviewItem = (field, index) => {
        const updated = formData.overview[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            overview: {
                ...formData.overview,
                [field]: updated
            }
        });
    };

    const handleAddCourseContent = () => {
        setFormData({
            ...formData,
            courseContent: [
                ...formData.courseContent,
                { moduleTitle: "", moduleDescription: "", preview: "" }
            ]
        });
    };

    const handleCourseContentChange = (index, field, value) => {
        const updated = [...formData.courseContent];
        updated[index][field] = value;
        setFormData({ ...formData, courseContent: updated });
    };

    const handleRemoveCourseContent = (index) => {
        const updated = formData.courseContent.filter((_, i) => i !== index);
        setFormData({ ...formData, courseContent: updated });
    };

    const handleRelatedCoursesChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, relatedCourses: selected });
    };

    console.log(formData)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            showToast("Please fill all the required fields", "warning");
            setButtonLoading(false);
            return;
        }


        if ((formData.image1 && formData.image1.size > MAX_IMAGE_SIZE_BYTES) ||
            (formData.image2 && formData.image2.size > MAX_IMAGE_SIZE_BYTES)) {
            showToast(`Image size should not exceed ${MAX_IMAGE_SIZE_MB} MB`, "warning");
            return;
        }

        setButtonLoading(true);

        try {

            const url = itemId
                ? `${getBaseURL()}/course/learning-method/${itemId}`
                : `${getBaseURL()}/course/learning-method`;
            const method = itemId ? "put" : "post";

            const response = await getAxios()[method](url, formData, { headers: { Authorization: `Bearer ${getHeaders().token}` } });

            if (response.status === 200 || response.status === 201) {
                showToast(itemId ? "Entry Updated Successfully" : "Entry Submitted Successfully", "success", 3000);
                setFormData({
                    name: "",
                    price: "",
                    newPrice: "",
                    vatIncluded: true,
                    duration: "",
                    durationHours: "",
                    weeks: "",
                    code: "",
                    techType: "",
                    whatsIncluded: "",
                    description: "",
                    whatYouWillLearn: [],
                    includes: [],
                    schedules: [],
                    overview: {
                        description: "",
                        targetAudience: [],
                        prerequisites: [],
                        benefits: []
                    },
                });
                setTimeout(() => navigate(-1), 3000);
            } else {
                throw new Error("Unexpected response");
            }
        } catch (error) {
            showToast(error?.response?.data?.message || error?.message || "Error saving entry", "danger");
        }

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
            <CCardHeader>
                <strong>{itemId ? "Edit" : "Add"} Learning Method</strong>
            </CCardHeader>
            <CCardBody>
                <CForm onSubmit={handleSubmit}>
                    <CRow>
                        <CCol md={6} className="mb-3">
                            <CFormSelect
                                label="Learning Method"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Learning Method</option>
                                {
                                    learningMethods?.map((c, i) =>
                                        <option value={c?._id} key={i}>{c?.name}</option>
                                    )
                                }
                            </CFormSelect>
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                label="Cource Code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                label="Offer Price"
                                name="newPrice"
                                type="number"
                                value={formData.newPrice}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12}>
                            <CFormCheck
                                className="mb-3 fw-bold"
                                label="Is Vat Included?"
                                checked={formData.vatIncluded}
                                onChange={(e) => setFormData({ ...formData, vatIncluded: e.target.checked })}
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                label="Duration Hours"
                                name="durationHours"
                                type="number"
                                value={formData.durationHours}
                                onChange={(e) => {
                                    const hours = Number(e.target.value);
                                    const weeks = hours / 168; // 1 week = 168 hours

                                    setFormData({
                                        ...formData,
                                        durationHours: e.target.value,
                                        weeks: weeks >= 1 ? weeks.toFixed(0) : ""
                                    });

                                }}
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormInput
                                label="Weeks"
                                name="weeks"
                                type="number"
                                disabled
                                value={formData.weeks}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3 mb-3">
                            <CFormTextarea
                                label="Duration Description"
                                name="duration"
                                rows={2}
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3 mb-3">
                            <CFormTextarea
                                label="Tech Type"
                                name="techType"
                                rows={2}
                                value={formData.techType}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3 mb-3">
                            <CFormTextarea
                                label="What's Included"
                                name="whatsIncluded"
                                rows={2}
                                value={formData.whatsIncluded}
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
                        <CCol md={12} className="mb-3">
                            <label className="fw-bold mb-2 me-2">What You Will Learn</label>
                            {formData.whatYouWillLearn?.map((point, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center">
                                    <CFormInput
                                        type="text"
                                        value={point}
                                        placeholder={`Learning Point ${index + 1}`}
                                        onChange={(e) => handleLearningPointChange(index, e.target.value)}
                                    />

                                    <img
                                        src={del}
                                        alt="Delete"
                                        className="ms-2"
                                        title="Delete Course"
                                        onClick={() => handleRemoveLearningPoint(index)}
                                        style={{
                                            margin: "0px 5px",
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            ))}
                            <CButton
                                color="primary"
                                onClick={handleAddLearningPoint}
                            >
                                + Add
                            </CButton>
                        </CCol>

                        <CCol md={12} className="mb-3">
                            <label className="fw-bold mb-2 me-2">This Course Includes</label>
                            {formData.includes?.map((item, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center">
                                    <CFormSelect
                                        value={item.icon}
                                        onChange={(e) => handleIncludeChange(index, "icon", e.target.value)}
                                        style={{ maxWidth: "200px", marginRight: "10px" }}
                                    >
                                        <option value="">Select Icon</option>
                                        {includeIcons?.map((opt, i) => (
                                            <option key={i} value={opt._id}>
                                                {opt.name}
                                            </option>
                                        ))}
                                    </CFormSelect>

                                    {item?.icon && (
                                        <img
                                            src={includeIcons?.find(opt => opt._id === item?.icon)?.icon}
                                            alt="icon"
                                            style={{ width: "30px", height: "30px", marginRight: "10px" }}
                                        />
                                    )}

                                    <CFormInput
                                        type="text"
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) => handleIncludeChange(index, "description", e.target.value)}
                                    />

                                    <img
                                        src={del}
                                        alt="Delete"
                                        className="ms-2"
                                        title="Remove"
                                        onClick={() => handleRemoveInclude(index)}
                                        style={{
                                            margin: "0px 5px",
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            ))}

                            <CButton
                                color="primary"
                                onClick={handleAddInclude}
                            >
                                + Add
                            </CButton>
                        </CCol>

                        <CCol md={12} className="mb-3">
                            <label className="fw-bold mb-2 me-2">Schedules</label>
                            {formData.schedules?.map((schedule, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center">
                                    {/* Start Date */}
                                    <CFormInput
                                        type="date"
                                        value={schedule.startDate}
                                        onChange={(e) => handleScheduleChange(index, "startDate", e.target.value)}
                                        style={{ marginRight: "10px", width: 'fit-content' }}
                                    />

                                    {/* Spaces */}
                                    <CFormInput
                                        type="text"
                                        placeholder="Spaces"
                                        value={schedule.spaces}
                                        onChange={(e) => handleScheduleChange(index, "spaces", e.target.value)}
                                        style={{ maxWidth: "200px", marginRight: "10px" }}
                                    />

                                    <img
                                        src={del}
                                        alt="Delete"
                                        className="ms-2"
                                        title="Remove"
                                        onClick={() => handleRemoveSchedule(index)}
                                        style={{
                                            margin: "0px 5px",
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            ))}

                            <CButton color="primary" onClick={handleAddSchedule}>
                                + Add
                            </CButton>
                        </CCol>

                        {/* Overview Section */}
                        <CCol md={12} className="mb-4">
                            <h5 className="fw-bold">Overview</h5>

                            {/* Overview Description */}
                            <CFormTextarea
                                label="Overview Description"
                                rows={3}
                                value={formData.overview?.description}
                                onChange={(e) => handleOverviewChange("description", e.target.value)}
                            />

                            {/* Target Audience */}
                            <div className="mt-3">
                                <label className="fw-bold mb-2 me-2">Target Audience</label>
                                {formData.overview.targetAudience?.map((audience, index) => (
                                    <div key={index} className="d-flex mb-2 align-items-center">
                                        <CFormInput
                                            type="text"
                                            value={audience}
                                            placeholder={`Audience ${index + 1}`}
                                            onChange={(e) =>
                                                handleOverviewItemChange("targetAudience", index, e.target.value)
                                            }
                                        />
                                        <img
                                            src={del}
                                            alt="Delete"
                                            className="ms-2"
                                            title="Remove"
                                            onClick={() => handleRemoveOverviewItem("targetAudience", index)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                ))}
                                <CButton color="primary" onClick={() => handleAddOverviewItem("targetAudience")}>
                                    + Add
                                </CButton>
                            </div>

                            <div className="mt-3">
                                <label className="fw-bold me-2 mb-2">Prerequisites</label>
                                {formData.overview.prerequisites?.map((pre, index) => (
                                    <div key={index} className="d-flex mb-2 align-items-center">
                                        <CFormInput
                                            type="text"
                                            value={pre}
                                            placeholder={`Prerequisite ${index + 1}`}
                                            onChange={(e) =>
                                                handleOverviewItemChange("prerequisites", index, e.target.value)
                                            }
                                        />
                                        <img
                                            src={del}
                                            alt="Delete"
                                            className="ms-2"
                                            title="Remove"
                                            onClick={() => handleRemoveOverviewItem("prerequisites", index)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                ))}
                                <CButton color="primary" onClick={() => handleAddOverviewItem("prerequisites")}>
                                    + Add
                                </CButton>
                            </div>

                            {/* Benefits */}
                            <div className="mt-3">
                                <label className="fw-bold me-2 mb-2">Benefits</label>
                                {formData.overview.benefits?.map((ben, index) => (
                                    <div key={index} className="d-flex mb-2 align-items-center">
                                        <CFormInput
                                            type="text"
                                            value={ben}
                                            placeholder={`Benefit ${index + 1}`}
                                            onChange={(e) =>
                                                handleOverviewItemChange("benefits", index, e.target.value)
                                            }
                                        />
                                        <img
                                            src={del}
                                            alt="Delete"
                                            className="ms-2"
                                            title="Remove"
                                            onClick={() => handleRemoveOverviewItem("benefits", index)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                ))}
                                <CButton color="primary" onClick={() => handleAddOverviewItem("benefits")}>
                                    + Add
                                </CButton>
                            </div>
                        </CCol>

                        {/* Course Content Section */}
                        <CCol md={12} className="mb-4">
                            <h5 className="fw-bold">Course Content</h5>

                            {formData.courseContent?.map((content, index) => (
                                <div key={index} className="p-3 mb-3 border rounded">
                                    <img
                                        src={del}
                                        alt="Delete"
                                        title="Remove Module"
                                        onClick={() => handleRemoveCourseContent(index)}
                                        style={{
                                            cursor: "pointer",
                                            float: 'right'
                                        }}
                                    />
                                    <CFormInput
                                        label="Module Title"
                                        value={content.moduleTitle}
                                        onChange={(e) => handleCourseContentChange(index, "moduleTitle", e.target.value)}
                                        className="mb-2 mt-1"
                                    />

                                    <CFormTextarea
                                        label="Module Description"
                                        rows={3}
                                        value={content.moduleDescription}
                                        onChange={(e) => handleCourseContentChange(index, "moduleDescription", e.target.value)}
                                        className="mb-2"
                                    />

                                    <CFormInput
                                        label="Preview (e.g., video link or text)"
                                        value={content.preview}
                                        onChange={(e) => handleCourseContentChange(index, "preview", e.target.value)}
                                        className="mb-2"
                                    />
                                </div>
                            ))}

                            <CButton color="primary" onClick={handleAddCourseContent}>
                                + Add Module
                            </CButton>
                        </CCol>

                        <CCol md={6} className="mb-3">
                            <CFormSelect
                                label="Related Courses"
                                value={formData.relatedCourses}
                                onChange={handleRelatedCoursesChange}
                            >
                                {courses?.map((course, i) => (
                                    <option key={i} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </CFormSelect>
                            <small className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
                        </CCol>

                    </CRow>

                    <CButton color="primary" type="submit" disabled={buttonLoading}>
                        {buttonLoading ? <CSpinner size="sm" /> : itemId ? "Edit Learning Method" : "Create Learning Method"}
                    </CButton>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default LearningMethod;
