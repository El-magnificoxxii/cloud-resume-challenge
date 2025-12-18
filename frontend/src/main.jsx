import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from './Layout.jsx'
import HomePage from 'pages/HomePage'
import ResumePage from 'pages/ResumePage'
import ProjectsPage from 'pages/ProjectsPage'


createRoot(document.querySelector('main')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Route>
    </Routes>

  </BrowserRouter>
)
