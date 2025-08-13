import React, { useEffect, useState } from "react";
import {
    CButton, CCard, CCardBody, CCardHeader, CCol, CModal,
    CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow,
    CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell,
    CTableRow, CFormInput
} from "@coreui/react";
import { getAxios, getBaseURL, getHeaders } from "../../api/config";
import CustomToast from "../../components/CustomToast/CustomToast";
import del from "../../assets/brand/delete.png";
import edit from "../../assets/brand/edit.png";

const API_URL = `${getBaseURL()}/course/includes`;

const CourseIncludes = () => {
    const [items, setItems] = useState([]);
    const [toastFlag, setToastFlag] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [deleteID, setDeleteID] = useState("");
    const [formName, setFormName] = useState("");
    const [formImage, setFormImage] = useState(null);
    const [editID, setEditID] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = getHeaders().token;
            const res = await getAxios().get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data || []);
        } catch {
            showToast("Error fetching data", "danger");
        }
    };

    const showToast = (msg, color) => {
        setToastMessage(msg);
        setToastColor(color);
        setToastFlag(true);
        setTimeout(() => setToastFlag(false), 2000);
    };

    const onDeleteGetID = (id) => {
        setDeleteID(id);
        setVisibleDelete(true);
    };

    const onDelete = async () => {
        try {
            const token = getHeaders().token;
            await getAxios().delete(`${API_URL}/${deleteID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVisibleDelete(false);
            fetchData();
            showToast("Deleted successfully", "success");
        } catch {
            setVisibleDelete(false);
            showToast("Error deleting", "danger");
        }
    };

    const onSave = async () => {
        if (!formName.trim()) return showToast("Name is required", "danger");
        if (!editID && !formImage) return showToast("Image is required", "danger");

        try {
            const token = getHeaders().token;
            const formData = new FormData();
            formData.append("name", formName);
            if (formImage) formData.append("icon", formImage);

            if (editID) {
                await getAxios().put(`${API_URL}/${editID}`, formData, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
                });
                showToast("Updated successfully", "success");
            } else {
                await getAxios().post(API_URL, formData, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
                });
                showToast("Added successfully", "success");
            }

            setVisibleForm(false);
            setFormName("");
            setFormImage(null);
            setEditID(null);
            fetchData()
        } catch {
            showToast("Error saving data", "danger");
        }
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
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader style={{ fontWeight: "600", fontSize: "20px" }}>
                            Course Includes
                        </CCardHeader>
                        <CCardBody>
                            <div style={{ display: "flex", justifyContent: "end" }}>
                                <CButton color="primary"
                                    className="my-2"
                                    onClick={() => {
                                        setFormName("");
                                        setFormImage(null);
                                        setEditID(null);
                                        setVisibleForm(true);
                                    }}
                                >
                                    Add Include
                                </CButton>
                            </div>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell>Sr.no</CTableHeaderCell>
                                        <CTableHeaderCell>Icon</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {items.length > 0 ? (
                                        items.map((item, index) => (
                                            <CTableRow key={item._id}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>
                                                    {item.icon && (
                                                        <img
                                                            src={item.icon}
                                                            alt="Icon"
                                                            style={{ width: "40px", height: "40px", objectFit: "contain" }}
                                                        />
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell>{item.name}</CTableDataCell>
                                                <CTableDataCell>
                                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                        <img
                                                            src={edit}
                                                            alt="Edit"
                                                            title="Edit"
                                                            onClick={() => {
                                                                setFormName(item.name);
                                                                setEditID(item._id);
                                                                setFormImage(null);
                                                                setVisibleForm(true);
                                                            }}
                                                            style={{ cursor: "pointer", width: "20px" }}
                                                        />
                                                        <img
                                                            src={del}
                                                            alt="Delete"
                                                            title="Delete"
                                                            onClick={() => onDeleteGetID(item._id)}
                                                            style={{ cursor: "pointer", width: "20px" }}
                                                        />
                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan="4" className="text-center">
                                                No Data Found
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Add/Edit Modal */}
            <CModal alignment="center" visible={visibleForm} onClose={() => setVisibleForm(false)}>
                <CModalHeader>
                    <CModalTitle>{editID ? "Edit Include" : "Add Include"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="text"
                        placeholder="Enter name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="mb-3"
                    />
                    <CFormInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormImage(e.target.files[0])}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleForm(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={onSave}>Save</CButton>
                </CModalFooter>
            </CModal>

            {/* Delete Confirmation */}
            <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
                <CModalBody>Are you sure you want to delete this entry?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleDelete(false)}>No</CButton>
                    <CButton color="primary" onClick={onDelete}>Yes</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default CourseIncludes;
