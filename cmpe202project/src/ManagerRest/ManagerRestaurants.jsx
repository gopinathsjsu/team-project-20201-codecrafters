import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import "../styles/ManagerLayout.css"; // We'll define it next

const ManagerRestaurants = () => {
  return (
    <div className="manager-layout">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default ManagerRestaurants;
