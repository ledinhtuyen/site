"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Provider = ({ children }) => (
  <>
    <ToastContainer 
     position="top-center"
     autoClose={2000}
     hideProgressBar={false}
     newestOnTop={false}
     closeOnClick
     rtl={false}
     pauseOnFocusLoss
     draggable
     pauseOnHover
     theme="colored"
    />
    {children}
  </>
);

export default Provider;
