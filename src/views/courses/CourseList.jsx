import React, { useEffect, useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CModal,
    CModalBody,
    CModalFooter,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import del from "../../assets/brand/delete.png";
import edit from "../../assets/brand/edit.png"
import { getAxios, getBaseURL, getHeaders } from "../../api/config";
import CustomToast from "../../components/CustomToast/CustomToast";

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toastFlag, setToastFlag] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");
    const [deleteID, setDeleteID] = useState("");
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const navigate = useNavigate();

    const fetchCourses = async () => {
        const url = `${getBaseURL()}/course/list?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`;
        const token = getHeaders().token;
        try {
            const response = await getAxios().get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCourses(response?.data?.data || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
        } catch (err) {
            setToastFlag(true);
            setToastMessage("Error fetching courses");
            setToastColor("danger");
            setTimeout(() => setToastFlag(false), 2000);
        }
    };

    const onDeleteGetID = (_id) => {
        setDeleteID(_id);
        setVisible(true);
    };

    const onDelete = async () => {
        const url = `${getBaseURL()}/course/delete/${deleteID}`;
        const token = getHeaders().token;
        try {
            const response = await getAxios().delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setVisible(false);
                fetchCourses();
                setToastFlag(true);
                setToastMessage("Course deleted successfully");
                setToastColor("success");
                setTimeout(() => setToastFlag(false), 2000);
            }
        } catch (error) {
            setVisible(false);
            setToastFlag(true);
            setToastMessage("Error deleting course");
            setToastColor("danger");
            setTimeout(() => setToastFlag(false), 2000);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    useEffect(() => {
        fetchCourses();
    }, [searchQuery, currentPage]);

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
                            Courses List
                        </CCardHeader>
                        <CCardBody>
                            <div style={{ display: "flex", justifyContent: "end", alignItems: 'center', marginBottom: "10px" }}>
                                <CButton color="primary"
                                    className="ms-2"
                                    onClick={() => navigate("/course-form")}
                                >
                                    Add Course
                                </CButton>
                            </div>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell>Sr.no</CTableHeaderCell>
                                        <CTableHeaderCell>Course Name</CTableHeaderCell>
                                        <CTableHeaderCell>Categories</CTableHeaderCell>
                                        <CTableHeaderCell>Badge</CTableHeaderCell>
                                        <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {courses?.map((item, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </CTableDataCell>
                                            <CTableDataCell>{item?.name}</CTableDataCell>
                                            <CTableDataCell>
                                                {item?.categories?.map((cat) => cat?.name).join(", ")}
                                            </CTableDataCell>
                                            <CTableDataCell>{item?.badge?.name}</CTableDataCell>
                                            <CTableDataCell>
                                                <img
                                                    src={edit}
                                                    alt="Edit icon"
                                                    title="Edit"
                                                    onClick={() => navigate("/course-form", { state: { id: item._id } })}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <img
                                                    src={del}
                                                    alt="Delete"
                                                    title="Delete Course"
                                                    onClick={() => onDeleteGetID(item?._id)}
                                                    style={{
                                                        color: "red",
                                                        margin: "0px 5px",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                            <div
                                className="pagination mt-3 fw-bold"
                                style={{ display: "flex", justifyContent: "end" }}
                            >
                                <CButton
                                    style={{ backgroundColor: "#43B8F5" }}
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </CButton>
                                <span className="mx-3" style={{ marginTop: "5px" }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <CButton
                                    style={{ backgroundColor: "#43B8F5" }}
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </CButton>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalBody>Are you sure you want to delete this course?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        No
                    </CButton>
                    <CButton color="primary" onClick={onDelete}>
                        Yes
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default CoursesList;
