import React, { useEffect, useState } from "react"
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormInput,
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
} from "@coreui/react"
import { getAxios, getBaseURL, getHeaders } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"
import del from "src/assets/brand/delete.png"
import edit from "src/assets/brand/edit.png"
import { useNavigate } from "react-router-dom"

const FAQList = () => {
    const [faqs, setFaqs] = useState([])
    const [toastFlag, settoastFlag] = useState(false)
    const [toastMessage, settoastMessage] = useState("")
    const [toastColor, settoastColor] = useState("")
    const [deleteID, setDeleteID] = useState("")
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const fetchData = async () => {
        const url = `${getBaseURL()}/faqs`
        const token = getHeaders().token
        try {
            const response = await getAxios().get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setFaqs(response?.data || [])
        } catch (err) {
            settoastFlag(true)
            settoastMessage("Error fetching FAQs")
            settoastColor("danger")
            setTimeout(() => settoastFlag(false), 2000)
        }
    }

    const onDeleteGetID = (_id) => {
        setDeleteID(_id)
        setVisible(true)
    }

    const onDelete = async () => {
        const url = `${getBaseURL()}/faqs/${deleteID}`
        const token = getHeaders().token
        try {
            const response = await getAxios().delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.status === 200) {
                setVisible(false)
                fetchData()
                settoastFlag(true)
                settoastMessage("FAQ Deleted Successfully")
                settoastColor("success")
            }
        } catch (error) {
            setVisible(false)
            settoastFlag(true)
            settoastMessage("Error deleting FAQ")
            settoastColor("danger")
        }
        setTimeout(() => settoastFlag(false), 2000)
    }

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
                            <div style={{ display: "flex", justifyContent: "end" }}>
                                <CButton style={{ backgroundColor: '#50C878' }} onClick={() => navigate("/faq")} className="my-2" type="#50C878">
                                    Add FAQ
                                </CButton>
                            </div>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell className="bg-body-tertiary">Sr.no</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Question</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Answer</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {faqs.length > 0 ? (
                                        faqs.map((faq, index) => (
                                            <CTableRow key={faq._id}>
                                                <CTableDataCell>
                                                    {index + 1}
                                                </CTableDataCell>
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
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalBody>Are you sure you want to delete this FAQ?</CModalBody>
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
    )
}

export default FAQList
