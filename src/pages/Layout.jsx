import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <React.Fragment>
      {/* <Navbar toggleSidebar={toggleSidebar} /> */}
      <div className="flex min-h-screen">
        <SideBar />
        {/* Main content */}
        <div className={`flex-1 bg-white`}>
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
