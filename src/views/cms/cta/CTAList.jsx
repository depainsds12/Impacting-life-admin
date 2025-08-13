import React, { useEffect, useState } from "react"
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
    CImage,
} from "@coreui/react"
import { getAxios, getBaseURL, getHeaders } from "../../../api/config"
import CustomToast from "../../../components/CustomToast/CustomToast"
import del from "../../../assets/brand/delete.png"
import edit from "../../../assets/brand/edit.png"
import { useNavigate } from "react-router-dom"

const CTAList = () => {
    const [items, setItems] = useState([])
    const [toastFlag, setToastFlag] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [toastColor, setToastColor] = useState("")
    const [deleteID, setDeleteID] = useState("")
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const fetchData = async () => {
        const url = `${getBaseURL()}/cms/cta`
        const token = getHeaders().token
        try {
            const response = await getAxios().get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setItems(response?.data || [])
        } catch (err) {
            setToastFlag(true)
            setToastMessage("Error fetching CTA data")
            setToastColor("danger")
            setTimeout(() => setToastFlag(false), 2000)
        }
    }

    const onDeleteGetID = (_id) => {
        setDeleteID(_id)
        setVisible(true)
    }

    const onDelete = async () => {
        const url = `${getBaseURL()}/cms/cta/${deleteID}`
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
                setToastFlag(true)
                setToastMessage("Entry Deleted Successfully")
                setToastColor("success")
            }
        } catch (error) {
            setVisible(false)
            setToastFlag(true)
            setToastMessage("Error deleting entry")
            setToastColor("danger")
        }
        setTimeout(() => setToastFlag(false), 2000)
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                            CTA List
                        </CCardHeader>
                        <CCardBody>
                            <div style={{ display: "flex", justifyContent: "end" }}>
                                <CButton color="primary" onClick={() => navigate("/cta-form")} className="my-2">
                                    Add CTA
                                </CButton>
                            </div>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell className="bg-body-tertiary">Sr.no</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Image</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Title</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Pages</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Description</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Links</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {items.length > 0 ? (
                                        items.map((item, index) => (
                                            <CTableRow key={item._id}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CImage src={item.image} width={60} height={60} style={{ objectFit: 'cover' }} />
                                                </CTableDataCell>
                                                <CTableDataCell>{item.title}</CTableDataCell>
                                                <CTableDataCell>
                                                    {item.slug?.join(", ")}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div style={{ maxWidth: "250px", whiteSpace: "pre-wrap" }}>
                                                        {item.description}
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div>
                                                        {item.link1 && <div>Link 1: {item.link1}</div>}
                                                        {item.link2 && <div>Link 2: {item.link2}</div>}
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                        <img
                                                            src={edit}
                                                            alt="Edit icon"
                                                            title="Edit"
                                                            onClick={() => navigate("/cta-form", { state: { id: item._id } })}
                                                            style={{ cursor: "pointer", width: "20px" }}
                                                        />
                                                        <img
                                                            src={del}
                                                            alt="Delete icon"
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
                                            <CTableDataCell colSpan="7" className="text-center">
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

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalBody>Are you sure you want to delete this entry?</CModalBody>
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

export default CTAList
