import {
    CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput,
    CFormLabel, CRow, CSpinner, CFormTextarea
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { getAxios, getBaseURL, getHeaders } from "../../../api/config";
import CustomToast from "../../../components/CustomToast/CustomToast";
import del from "../../../assets/brand/delete.png"

const sectionKeys = [
    { key: "businessCreativeSkills", label: "Business & Creative Skills" },
    { key: "technicalSkills", label: "Technical Skills" },
    { key: "analyticalDataSkills", label: "Analytical & Data Skills" },
    { key: "careerResources", label: "Career Resources" },
    { key: "about", label: "About Impacting Life" },
    { key: "communitySupport", label: "Community & Support" }
];

const FooterCmsForm = () => {
    const [toastFlag, setToastFlag] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const [footerData, setFooterData] = useState({
        businessCreativeSkills: [{ title: "", link: "" }],
        technicalSkills: [{ title: "", link: "" }],
        analyticalDataSkills: [{ title: "", link: "" }],
        careerResources: [{ title: "", link: "" }],
        about: [{ title: "", link: "" }],
        communitySupport: [{ title: "", link: "" }],
        contact: {
            email: "",
            address: "",
            phone: "",
            socialLinks: {
                facebook: "",
                linkedin: "",
                instagram: "",
                x: "",
                google: ""
            }
        },
        newsletter: {
            title: "",
            description: "",
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAxios().get(`${getBaseURL()}/cms/footer`, {
                    headers: { Authorization: `Bearer ${getHeaders().token}` }
                });
                setFooterData(res.data);
            } catch (error) {
                showToast("Error fetching footer", "danger");
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

    const handleArrayChange = (sectionKey, index, field, value) => {
        const updatedSection = [...footerData[sectionKey]];
        updatedSection[index][field] = value;
        setFooterData({ ...footerData, [sectionKey]: updatedSection });
    };

    const addItem = (sectionKey) => {
        setFooterData({
            ...footerData,
            [sectionKey]: [...footerData[sectionKey], { title: "", link: "" }]
        });
    };

    const removeItem = (sectionKey, index) => {
        const updatedSection = [...footerData[sectionKey]];
        updatedSection.splice(index, 1);
        setFooterData({ ...footerData, [sectionKey]: updatedSection });
    };

    const handleNestedChange = (path, value) => {
        const keys = path.split(".");
        const data = { ...footerData };
        let current = data;
        keys.forEach((key, i) => {
            if (i === keys.length - 1) current[key] = value;
            else current = current[key];
        });
        setFooterData(data);
    };

    const onSubmit = async () => {
        setButtonLoading(true);
        try {
            const url = `${getBaseURL()}/cms/footer`;
            const method = "post";

            const res = await getAxios()[method](url, footerData, {
                headers: {
                    Authorization: `Bearer ${getHeaders().token}`
                }
            });

            if (res.status === 200 || res.status === 201) {
                showToast("Footer Updated", "success");
            } else throw new Error("Unexpected response");
        } catch (err) {
            showToast("Failed to save footer", "danger");
        }
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
                            <strong>{"Create Footer"}</strong>
                        </CCardHeader>
                        <CCardBody>
                            {sectionKeys.map(({ key, label }) => (
                                <div className="mb-4" key={key}>
                                    <CFormLabel className="fw-bold me-2">{label}</CFormLabel>
                                    {footerData[key]?.map((item, idx) => (
                                        <CRow key={idx} className="align-items-center mb-2">
                                            <CCol md={5}>
                                                <CFormInput
                                                    placeholder="Title"
                                                    value={item.title}
                                                    onChange={(e) => handleArrayChange(key, idx, "title", e.target.value)}
                                                />
                                            </CCol>
                                            <CCol md={5}>
                                                <CFormInput
                                                    placeholder="Link"
                                                    value={item.link}
                                                    onChange={(e) => handleArrayChange(key, idx, "link", e.target.value)}
                                                />
                                            </CCol>
                                            <CCol md={2}>
                                                <img
                                                    src={del}
                                                    alt="Delete icon"
                                                    title="Delete"
                                                    onClick={() => removeItem(key, idx)}
                                                    style={{ cursor: "pointer", width: "20px" }}
                                                />
                                            </CCol>
                                        </CRow>
                                    ))}
                                    <CButton color="primary" style={{ color: "white" }} onClick={() => addItem(key)}>+ Add {label} Item</CButton>
                                </div>
                            ))}

                            <hr />
                            <h5>Contact Info</h5>
                            <CFormInput className="mb-2" placeholder="Email"
                                value={footerData.contact.email}
                                onChange={(e) => handleNestedChange("contact.email", e.target.value)} />
                            <CFormInput className="mb-2" placeholder="Address"
                                value={footerData.contact.address}
                                onChange={(e) => handleNestedChange("contact.address", e.target.value)} />
                            <CFormInput className="mb-2" placeholder="Phone"
                                value={footerData.contact.phone}
                                onChange={(e) => handleNestedChange("contact.phone", e.target.value)} />

                            <h6 className="mt-3">Social Links</h6>
                            {["facebook", "linkedin", "instagram", "x", "google"].map((platform) => (
                                <CFormInput key={platform} className="mb-2" placeholder={platform}
                                    value={footerData.contact.socialLinks[platform]}
                                    onChange={(e) => handleNestedChange(`contact.socialLinks.${platform}`, e.target.value)} />
                            ))}

                            <hr />
                            <h5>Newsletter</h5>
                            <CFormInput className="mb-3" placeholder="Title"
                                value={footerData.newsletter.title}
                                onChange={(e) => handleNestedChange("newsletter.title", e.target.value)} />
                            <CFormTextarea className="mb-2" rows={3} placeholder="Description"
                                value={footerData.newsletter.description}
                                onChange={(e) => handleNestedChange("newsletter.description", e.target.value)} />

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

export default FooterCmsForm;
