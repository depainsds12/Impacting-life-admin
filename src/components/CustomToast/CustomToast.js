import React from "react"
import "./Toast.css" // We will style the toast later
import { CToast, CToastBody, CToastClose } from "@coreui/react"

// eslint-disable-next-line react/prop-types
const CustomToast = ({ message, show, onClose, color }) => {
  return (
    show && (
      <CToast
        autohide={true}
        color={color}
        className="text-white align-items-center"
        visible={true}
        placement="top-start"
      >
        <div className="d-flex">
          <CToastBody>{message}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    )
  )
}

export default CustomToast
