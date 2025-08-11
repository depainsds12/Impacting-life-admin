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
  CImage,
} from "@coreui/react"
import { getAxios, getBaseURL, getHeaders } from "../../../../api/config"
import CustomToast from "../../../../components/CustomToast/CustomToast"
import del from "../../../../assets/brand/delete.png"
import edit from "../../../../assets/brand/edit.png"
import { useNavigate } from "react-router-dom"
import { ReactSortable } from "react-sortablejs"

const Testimonials = () => {
  const [items, setItems] = useState([])
  const [toastFlag, setToastFlag] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("")
  const [deleteID, setDeleteID] = useState("")
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  const fetchData = async () => {
    const url = `${getBaseURL()}/cms/testimonials`
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
      setToastMessage("Error fetching Testimonials")
      setToastColor("danger")
      setTimeout(() => setToastFlag(false), 2000)
    }
  }

  const onDeleteGetID = (_id) => {
    setDeleteID(_id)
    setVisible(true)
  }

  const onDelete = async () => {
    const url = `${getBaseURL()}/cms/testimonials/${deleteID}`
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
        setToastMessage("Testimonial Deleted Successfully")
        setToastColor("success")
      }
    } catch (error) {
      setVisible(false)
      setToastFlag(true)
      setToastMessage("Error deleting testimonial")
      setToastColor("danger")
    }
    setTimeout(() => setToastFlag(false), 2000)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateTestimonialsOrder = async (order) => {
    const { oldIndex, newIndex } = order;

    if (oldIndex === newIndex) {
        return;
    }

    const updatedList = [...items];
    const [movedTag] = updatedList.splice(oldIndex, 1);
    updatedList.splice(newIndex, 0, movedTag);

    const updatedListWithPositions = updatedList.map((item, index) => ({
        ...item,
        order: index + 1,
    }));
    setItems(updatedListWithPositions);

    try {
        const token = getHeaders().token;
        const url = `${getBaseURL()}/cms/order-testimonials`;
        await getAxios().post(url, { orders: updatedListWithPositions }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // if (response.status === 200) {
        //     toast.success("FAQs reordered successfully");
        // } else {
        //     toast.error("Failed to reorder FAQs");
        // }
    } catch (error) {
        // console.error("Error updating FAQs order:", error);
        // toast.error("Failed to reorder FAQs");
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
              Testimonials List
            </CCardHeader>
            <CCardBody>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <CFormLabel style={{ fontWeight: 'bold' }}>Drag and drop the testimonials to update the order</CFormLabel>
                <CButton
                  style={{ backgroundColor: "#50C878" }}
                  onClick={() => navigate("/testimonial-form")}
                  className="my-2"
                >
                  Add Testimonial
                </CButton>
              </div>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Sr.no</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Image</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Designation</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Ratings</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Experience</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Description</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <ReactSortable
                  list={items}
                  setList={setItems}
                  onEnd={(newList) => updateTestimonialsOrder(newList)}
                  animation={150}
                  tag="tbody"
                >
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <CTableRow key={item._id} data-id={item._id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CImage
                            src={item.image}
                            width={60}
                            height={60}
                            style={{ objectFit: "cover" }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{item.name}</CTableDataCell>
                        <CTableDataCell>{item.designation}</CTableDataCell>
                        <CTableDataCell>{item.ratings} ⭐</CTableDataCell>
                        <CTableDataCell>{item.experience}</CTableDataCell>
                        <CTableDataCell>{item.description}</CTableDataCell>
                        <CTableDataCell>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <img
                              src={edit}
                              alt="Edit icon"
                              title="Edit"
                              onClick={() =>
                                navigate("/testimonial-form", { state: { id: item._id } })
                              }
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
                      <CTableDataCell colSpan="8" className="text-center">
                        No Testimonials Found
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
        <CModalBody>Are you sure you want to delete this testimonial?</CModalBody>
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

export default Testimonials
