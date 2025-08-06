import { cilBell, cilContrast, cilMenu, cilMoon, cilSun } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  useColorModes,
} from "@coreui/react"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { io } from "socket.io-client"
import { getHeaders } from "../api/config"
import { AppHeaderDropdown } from "./header/index"

const AppHeader = () => {
  const socketUrl = "https://udharaa.com"
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes("coreui-free-react-admin-template-theme")

  const token = getHeaders().token

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [socket, setSocket] = useState(null)
  const [socketID, setSocketID] = useState(null)
  const [newNotification, setNewNotification] = useState(false)
  const [contractSigned, setContractSigned] = useState(true)
  const [startConnection, setStartConnection] = useState(false)

  useEffect(() => {
    document.addEventListener("scroll", () => {
      headerRef.current &&
        headerRef.current.classList.toggle("shadow-sm", document.documentElement.scrollTop > 0)
    })
  }, [])

  useEffect(() => {
    let newSocket = ""
    if (localStorage.getItem("authToken")) {
      newSocket = io(socketUrl, {
        path: "/socket",
        // reconnection: true,
        transports: ["websocket", "polling"],
        // reconnectionAttempts: 5
        withCredentials: true,
      })

      setSocket(newSocket)
    }

    return () => {
      if (newSocket) {
        newSocket?.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    socket?.on("connect", () => {
      setSocketID(socket?.id)
    })

    socket?.on("disconnect", () => {
      setSocketID(null)
    })
  }, [socket])

  useEffect(() => {
    if (socket == null) return
    socket.emit("addNewUser", localStorage.getItem("UserID"), true)
    socket.on("new_notification", () => {
      setNewNotification(true)
    })
    return () => {
      socket?.off("new_notification")
    }
  }, [socket])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === "auto" ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === "light"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("light")}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "dark"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              {/* <CDropdownItem
                active={colorMode === "auto"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("auto")}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem> */}
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
