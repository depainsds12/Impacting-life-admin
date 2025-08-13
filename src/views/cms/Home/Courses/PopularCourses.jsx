import {
    CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput,
    CFormLabel, CRow, CSpinner, CFormTextarea
  } from "@coreui/react";
  import React, { useEffect, useState } from "react";
  import { getAxios, getBaseURL, getHeaders } from "../../../../api/config";
  import CustomToast from "../../../../components/CustomToast/CustomToast";
  
  const PopularCourses = () => {
    const [toastFlag, setToastFlag] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);
    const [data, setData] = useState({
      title: "",
      description: ""
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
          const res = await getAxios().get(`${getBaseURL()}/cms/popular-courses`, {
            headers: { Authorization: `Bearer ${getHeaders().token}` }
          });
          if (res.data.data) {
            setData({
              title: res.data.data.title || "",
              description: res.data.data.description || ""
            });
          }
        } catch (error) {
          showToast("Error fetching data", "danger");
        }
      };
      fetchData();
    }, []);
  
    const handleChange = (field, value) => {
      setData({ ...data, [field]: value });
    };
  
    const onSubmit = async () => {
      setButtonLoading(true);
      try {
        const url = `${getBaseURL()}/cms/popular-courses`;
        const method = "post";
  
        const res = await getAxios()[method](url, data, {
          headers: {
            Authorization: `Bearer ${getHeaders().token}`
          }
        });
  
        if (res.status === 200 || res.status === 201) {
          showToast("Popular courses Updated", "success");
        } else throw new Error("Unexpected response");
      } catch (err) {
        showToast("Failed to save popular courses", "danger");
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
                <strong>Manage Most Popular Courses</strong>
              </CCardHeader>
              <CCardBody>
                <CFormLabel className="fw-bold">Title</CFormLabel>
                <CFormInput
                  className="mb-3"
                  placeholder="Enter title"
                  value={data.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
  
                <CFormLabel className="fw-bold">Description</CFormLabel>
                <CFormTextarea
                  className="mb-3"
                  rows={6}
                  placeholder="Enter description"
                  value={data.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
  
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
  
  export default PopularCourses;
  