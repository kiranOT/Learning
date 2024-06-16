import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Successpage }  from "./components/Applications/LoginPage/Successpage.jsx"

let myRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/successpage",
    element: <Successpage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={myRoutes} />
  </React.StrictMode>,
)
