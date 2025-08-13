import {
    CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput,
    CFormLabel, CRow, CSpinner, CFormTextarea, CFormCheck
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { getAxios, getBaseURL, getHeaders } from "../../../api/config";
import CustomToast from "../../../components/CustomToast/CustomToast";

const AnnouncementForm = () => {
    const [toastFlag, setToastFlag] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const [announcementData, setAnnouncementData] = useState({
        message: "",
        linkText: "",
        linkUrl: "",
        isActive: true,
        startDate: "",
        endDate: ""
    });

    const showToast = (msg, color) => {
        setToastFlag(true);
        setToastMessage(msg);
        setToastColor(color);
        setTimeout(() => setToastFlag(false), 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAxios().get(`${getBaseURL()}/cms/announcements`, {
                    headers: { Authorization: `Bearer ${getHeaders().token}` }
                });
                if (res.data.data) {
                    setAnnouncementData({
                        ...res.data.data,
                        startDate: res.data.data.startDate ? res.data.data.startDate.split("T")[0] : "",
                        endDate: res.data.data.endDate ? res.data.data.endDate.split("T")[0] : ""
                    });
                }
            } catch (error) {
                showToast("Error fetching announcement", "danger");
            }
        };
        fetchData();
    }, []);

    const handleChange = (field, value) => {
        setAnnouncementData({ ...announcementData, [field]: value });
    };

    const onSubmit = async () => {
        setButtonLoading(true);
        try {
            const url = `${getBaseURL()}/cms/announcements`;
            const method = "post";

            const res = await getAxios()[method](url, announcementData, {
                headers: {
                    Authorization: `Bearer ${getHeaders().token}`
                }
            });

            if (res.status === 200 || res.status === 201) {
                showToast("Announcement Updated", "success");
            } else throw new Error("Unexpected response");
        } catch (err) {
            showToast("Failed to save announcement", "danger");
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
                            <strong>{"Manage Announcement"}</strong>
                        </CCardHeader>
                        <CCardBody>
                            <CFormLabel className="fw-bold">Message</CFormLabel>
                            <CFormTextarea
                                className="mb-3"
                                rows={2}
                                placeholder="Enter announcement message"
                                value={announcementData.message}
                                onChange={(e) => handleChange("message", e.target.value)}
                            />

                            <CFormLabel className="fw-bold">Link Text</CFormLabel>
                            <CFormInput
                                className="mb-3"
                                placeholder="Optional link text"
                                value={announcementData.linkText}
                                onChange={(e) => handleChange("linkText", e.target.value)}
                            />

                            <CFormLabel className="fw-bold">Link URL</CFormLabel>
                            <CFormInput
                                className="mb-3"
                                placeholder="Optional link URL"
                                value={announcementData.linkUrl}
                                onChange={(e) => handleChange("linkUrl", e.target.value)}
                            />

                            <CFormCheck
                                className="mb-3 fw-bold"
                                label="Is Active?"
                                checked={announcementData.isActive}
                                onChange={(e) => handleChange("isActive", e.target.checked)}
                            />

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel className="fw-bold">Start Date</CFormLabel>
                                    <CFormInput
                                        type="date"
                                        value={announcementData.startDate}
                                        onChange={(e) => handleChange("startDate", e.target.value)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel className="fw-bold">End Date</CFormLabel>
                                    <CFormInput
                                        type="date"
                                        value={announcementData.endDate}
                                        onChange={(e) => handleChange("endDate", e.target.value)}
                                    />
                                </CCol>
                            </CRow>

                            <CButton color="primary" onClick={onSubmit} disabled={buttonLoading}>
                                {buttonLoading ? <CSpinner size="sm" /> : "Update Announcement"}
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default AnnouncementForm;
