import React, { useContext } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import { CollegeContext } from "../Context/CollegeProvider";

const Layout = () => {
const{college} = useContext(CollegeContext)
  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="lg:ml-64 h-full flex flex-col">
        
        {/* Top Header / Boundary */}
        <div className="relative h-16 bg-white flex items-center px-4 shadow-sm z-20">
  
  {/* Hamburger space (button Sidebar component la irukum) */}
  
  {/* Title */}
  <h1 className="mx-autotext-base sm:text-xl lg:text-2xlfont-boldtext-centerleading-tightline-clamp-2px-12">
    {college.collegeName}
  </h1>

</div>


        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Blur Wrapper */}
          <div className="relative min-h-full">
            
            {/* Blur Layer */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-lg"></div>

            {/* Actual Content */}
            <div className="relative bg-white rounded-lg border p-4 min-h-full shadow">
              <Outlet />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Layout;
