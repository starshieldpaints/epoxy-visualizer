import React from "react";
import "../styles/main.css";

const Layout = ({ children }) => (
  <div className="app-layout">
    <div className="controls-panel">{children[0]}</div>
    <div className="scene-panel">{children[1]}</div>
  </div>
);

export default Layout;
