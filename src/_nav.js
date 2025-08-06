import React from "react"
import CIcon from "@coreui/icons-react"
import {
  cilHome,
  cilPuzzle,
  cilUser,
} from "@coreui/icons"
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react"

const _nav = [
  {
    component: CNavTitle,
    name: "User Types",
  },
  {
    component: CNavItem,
    name: "ContactUs List",
    to: "/contact-us-list",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "CMS",
  },
  {
    component: CNavGroup,
    name: "Home",
    // to: "/base",
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Banner",
        to: "/banner",
      },
      {
        component: CNavItem,
        name: "How It Works",
        to: "/how-it-works-cms",
      },
      {
        component: CNavItem,
        name: "Testimonials",
        to: "/testimonial-cms",
      },
      {
        component: CNavItem,
        name: "FAQs",
        to: "/faqs",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Footer",
    // to: "/base",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Privacy and Policy",
        to: "/privacy-policy",
      },
      {
        component: CNavItem,
        name: "Terms&Conditions",
        to: "/terms-conditions",
      }
    ],
  },
]

export default _nav
