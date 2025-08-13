import React from "react"
import CIcon from "@coreui/icons-react"
import {
  cilApplications,
  cilBriefcase,
  cilHome,
  cilPuzzle,
  cilUser,
} from "@coreui/icons"
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react"

const _nav = [
  // {
  //   component: CNavTitle,
  //   name: "User Types",
  // },
  // {
  //   component: CNavItem,
  //   name: "ContactUs List",
  //   to: "/contact-us-list",
  //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  // },
  {

    component: CNavGroup,
    name: "Course Management",
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Courses",
        to: "/course-list",
      },
      {
        component: CNavItem,
        name: "Badges",
        to: "/badges",
      },
      {
        component: CNavItem,
        name: "Categories",
        to: "/categories",
      },
      {
        component: CNavItem,
        name: "Learning Methods",
        to: "/learning-methods",
      },
      {
        component: CNavItem,
        name: "Course Includes",
        to: "/course-includes",
      }
    ]
  },
  {
    component: CNavTitle,
    name: "CMS",
  },
  {

    component: CNavGroup,
    name: "Common CMS",
    // to: "/base",
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Announcements",
        to: "/announcements",
      },
      {
        component: CNavItem,
        name: "Banner",
        to: "/banners",
      },
      {
        component: CNavItem,
        name: "CTA",
        to: "/cta",
      },
    ]
  },
  {
    component: CNavGroup,
    name: "Home",
    // to: "/base",
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Popular Courses",
        to: "/popular-courses",
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
    name: "For Business",
    // to: "/base",
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Why To Choose",
        to: "/why-choose-impacting-life",
      },
    ]
  },
  {
    component: CNavGroup,
    name: "Footer",
    // to: "/base",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Footer",
        to: "/footer",
      },
      // {
      //   component: CNavItem,
      //   name: "Privacy and Policy",
      //   to: "/privacy-policy",
      // },
      // {
      //   component: CNavItem,
      //   name: "Terms&Conditions",
      //   to: "/terms-conditions",
      // }
    ],
  },
]

export default _nav
