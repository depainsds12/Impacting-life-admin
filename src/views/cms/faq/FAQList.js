import React, { useEffect, useState } from "react"
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CRow,
    CTable,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from "@coreui/react"
import { getAxios, getBaseURL, getHeaders } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"
import del from "src/assets/brand/delete.png"
import edit from "src/assets/brand/edit.png"
import { useNavigate } from "react-router-dom"
import { ReactSortable } from "react-sortablejs"

const FAQList = () => {
    const [faqs, setFaqs] = useState([])
    const [toastFlag, settoastFlag] = useState(false)
    const [toastMessage, settoastMessage] = useState("")
    const [toastColor, settoastColor] = useState("")
    const [deleteID, setDeleteID] = useState("")
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const fetchData = async () => {
        const url = `${getBaseURL()}/cms/faqs`
        const token = getHeaders().token
        try {
            const response = await getAxios().get(url, {
                headers: { Authorization: `Bearer ${token}` },
            })
            // sort by order before setting
            const sortedFaqs = (response?.data || []).sort((a, b) => a.order - b.order)
            setFaqs(sortedFaqs)
        } catch (err) {
            showToast("Error fetching FAQs", "danger")
        }
    }

    const showToast = (msg, color) => {
        settoastFlag(true)
        settoastMessage(msg)
        settoastColor(color)
        setTimeout(() => settoastFlag(false), 2000)
    }

    const onDeleteGetID = (_id) => {
        setDeleteID(_id)
        setVisible(true)
    }

    const onDelete = async () => {
        const url = `${getBaseURL()}/cms/faqs/${deleteID}`
        const token = getHeaders().token
        try {
            const response = await getAxios().delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.status === 200) {
                setVisible(false)
                fetchData()
                showToast("FAQ Deleted Successfully", "success")
            }
        } catch (error) {
            setVisible(false)
            showToast("Error deleting FAQ", "danger")
        }
    }

    const updateFAQOrder = async (order) => {
        const { oldIndex, newIndex } = order;

        if (oldIndex === newIndex) {
            return;
        }

        const updatedFaqs = [...faqs];
        const [movedTag] = updatedFaqs.splice(oldIndex, 1);
        updatedFaqs.splice(newIndex, 0, movedTag);

        const updatedFaqsWithPositions = updatedFaqs.map((item, index) => ({
            ...item,
            order: index + 1,
        }));
        setFaqs(updatedFaqsWithPositions);

        try {
            const token = getHeaders().token;
            const url = `${getBaseURL()}/cms/order-faqs`; // new API endpoint
            const response = await getAxios().post(url, { orders: updatedFaqsWithPositions }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("FAQs reordered successfully");
            } else {
                toast.error("Failed to reorder FAQs");
            }
        } catch (error) {
            console.error("Error updating FAQs order:", error);
            toast.error("Failed to reorder FAQs");
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <CustomToast
                message={toastMessage}
                show={toastFlag}
                onClose={() => settoastFlag(false)}
                color={toastColor}
            />
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader style={{ fontWeight: "600", fontSize: "20px" }}>
                            FAQ List
                        </CCardHeader>
                        <CCardBody>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                                <CFormLabel style={{ fontWeight: 'bold' }}>Drag and drop the FAQs to update the order</CFormLabel>
                                <CButton
                                    style={{ backgroundColor: "#50C878" }}
                                    onClick={() => navigate("/faq")}
                                    className="my-2"
                                >
                                    Add FAQ
                                </CButton>
                            </div>

                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell>Sr.no</CTableHeaderCell>
                                        <CTableHeaderCell>Question</CTableHeaderCell>
                                        <CTableHeaderCell>Answer</CTableHeaderCell>
                                        <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <ReactSortable
                                    list={faqs}
                                    setList={setFaqs}
                                    onEnd={(newList) => updateFAQOrder(newList)}
                                    animation={150}
                                    tag="tbody"

                                >
                                    {faqs.length > 0 ? (
                                        faqs.map((faq, index) => (
                                            <CTableRow key={faq._id} data-id={faq._id}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>{faq.question}</CTableDataCell>
                                                <CTableDataCell>
                                                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                        <img
                                                            src={edit}
                                                            alt="Edit icon"
                                                            title="Edit"
                                                            onClick={() => navigate("/faq", { state: { id: faq._id } })}
                                                            style={{ cursor: "pointer", width: "20px" }}
                                                        />
                                                        <img
                                                            src={del}
                                                            alt="Delete icon"
                                                            title="Delete"
                                                            onClick={() => onDeleteGetID(faq._id)}
                                                            style={{ cursor: "pointer", width: "20px" }}
                                                        />
                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan="4" className="text-center">
                                                No FAQs Found
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </ReactSortable>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalBody>Are you sure you want to delete this FAQ?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>No</CButton>
                    <CButton color="primary" onClick={onDelete}>Yes</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default FAQList
