import React from "react"
import { CFooter } from "@coreui/react"

const AppFooter = () => {
  const date = new Date()
  const currentYear = date.getFullYear()
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy;{currentYear} Impacting Life</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
