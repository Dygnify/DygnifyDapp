import React from "react";

const GradientButton = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: "100px",
        padding: "12px 24px",
        color: "white",
        fontSize: 16,
      }}
      className={`btn btn-wide bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize font-medium border-none ${className}`}
    >
      {children}
    </button>
  );
};

export default GradientButton;
