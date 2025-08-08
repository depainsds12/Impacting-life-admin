import {
    CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput,
    CFormLabel, CRow, CSpinner, CFormTextarea
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { getAxios, getBaseURL, getHeaders } from "../../../api/config";
import CustomToast from "../../../components/CustomToast/CustomToast";
import del from "../../../assets/brand/delete.png"

const WhyChooseCmsForm = () => {
    const [toastFlag, setToastFlag] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const [data, setData] = useState({
        title: "",
        description: "",
        mainImage: "",
        options: [
            { icon: "", title: "", description: "" }
        ],
        button1Text: "",
        button1Link: "",
        button2Text: "",
        button2Link: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAxios().get(`${getBaseURL()}/business/why-choose-impacting-life`, {
                    headers: { Authorization: `Bearer ${getHeaders().token}` }
                });
                if (res.data) setData(res.data);
            } catch (error) {
                showToast("Error fetching data", "danger");
            }
        };
        fetchData();
    }, []);

    const showToast = (msg, color) => {
        setToastFlag(true);
        setToastMessage(msg);
        setToastColor(color);
        setTimeout(() => setToastFlag(false), 2000);
    };

    const handleChange = (key, value) => setData({ ...data, [key]: value });

    const handleOptionChange = (index, key, value) => {
        const updated = [...data.options];
        updated[index][key] = value;
        setData({ ...data, options: updated });
    };

    const addOption = () => setData({
        ...data,
        options: [...data.options, { icon: "", title: "", description: "" }]
    });

    const removeOption = (index) => {
        const updated = [...data.options];
        updated.splice(index, 1);
        setData({ ...data, options: updated });
    };

    const onSubmit = async () => {
        setButtonLoading(true);
        try {
            const formData = new FormData();

            // Add main image
            if (data.mainImage instanceof File) {
                formData.append('mainImage', data.mainImage);
            }

            // Add option icons
            data.options.forEach((option, index) => {
                if (option.icon instanceof File) {
                    formData.append(`icon${index}`, option.icon);
                }
            });

            // Add other JSON data
            const payload = { ...data };
            delete payload.mainImage;
            payload.options = payload.options.map((opt) => {
                const copy = { ...opt };
                delete copy.icon;
                return copy;
            });

            formData.append('data', JSON.stringify(payload));
        } catch (err) {
            showToast("Failed to save section", "danger");
        }
        setButtonLoading(false);
    };

    const handleIconUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const updatedOptions = [...data.options];
        updatedOptions[index].icon = file;

        setData({ ...data, options: updatedOptions });
    };

    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData({ ...data, mainImage: file });
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
                            <strong>Why Choose Impacting Life</strong>
                        </CCardHeader>
                        <CCardBody>
                            <CFormInput className="mb-3" placeholder="Title"
                                value={data.title} onChange={(e) => handleChange("title", e.target.value)} />
                            <CFormTextarea className="mb-3" placeholder="Description" rows={3}
                                value={data.description} onChange={(e) => handleChange("description", e.target.value)} />
                            <div className="mb-3">
                                <CFormLabel>Main Image</CFormLabel>
                                {data.mainImage && (
                                    <div className="mb-2">
                                        <img src={data.mainImage} alt="main" style={{ height: 100 }} />
                                    </div>
                                )}
                                <CFormInput type="file" accept="image/*" onChange={handleMainImageUpload} />
                            </div>

                            <h6>Options</h6>
                            {data.options.map((item, idx) => (
                                <CRow key={idx} className="align-items-center mb-3">
                                    <CCol md={3}>
                                        <div className="d-flex flex-column">
                                            {item.icon && <div className="mb-1">Uploaded: {item.icon.split('/').pop()}</div>}
                                            <CFormInput type="file" accept="image/*" onChange={(e) => handleIconUpload(e, idx)} />
                                        </div>

                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput placeholder="Title"
                                            value={item.title} onChange={(e) => handleOptionChange(idx, "title", e.target.value)} />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput placeholder="Description"
                                            value={item.description} onChange={(e) => handleOptionChange(idx, "description", e.target.value)} />
                                    </CCol>
                                    <CCol md={1}>
                                        <img src={del} alt="Delete" onClick={() => removeOption(idx)}
                                            style={{ cursor: "pointer", width: "20px" }} />
                                    </CCol>
                                </CRow>
                            ))}


                            <CButton className="mb-3" style={{ backgroundColor: "#50C878", color: "white" }} onClick={addOption}>+ Add Option</CButton>

                            <h6>Buttons</h6>
                            <CFormInput className="mb-2" placeholder="Button 1 Text"
                                value={data.button1Text} onChange={(e) => handleChange("button1Text", e.target.value)} />
                            <CFormInput className="mb-2" placeholder="Button 1 Link"
                                value={data.button1Link} onChange={(e) => handleChange("button1Link", e.target.value)} />
                            <CFormInput className="mb-2" placeholder="Button 2 Text"
                                value={data.button2Text} onChange={(e) => handleChange("button2Text", e.target.value)} />
                            <CFormInput className="mb-2" placeholder="Button 2 Link"
                                value={data.button2Link} onChange={(e) => handleChange("button2Link", e.target.value)} />

                            <CButton color="primary" onClick={onSubmit} disabled={buttonLoading}>
                                {buttonLoading ? <CSpinner size="sm" /> : "Update"}
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default WhyChooseCmsForm;
