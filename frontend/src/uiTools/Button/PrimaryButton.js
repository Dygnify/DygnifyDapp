import React from "react";

const arrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
  </svg>
);

const PrimaryButton = ({
  children,
  htmlFor,
  width,
  onClick,
  disable,
  data,
}) => {
  return (
    <button
      onClick={disable ? null : onClick}
      htmlFor={htmlFor}
      className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full py-[0.4rem] font-medium flex fill-white  items-center justify-center "
      
      // style={{ borderRadius: "100px", padding: "12px 24px", color: "white" }}
      // className={`${
      //   disable
      //     ? `btn btn-secondary btn-wide bg-[#A0ABBB] capitalize font-medium border-none ${width}`
      //     : `btn btn-wide bg-blue-500  hover:bg-blue-500 capitalize font-medium border-none ${width}`
      // }`}
    >
      {children}{arrow}
    </button>
  );
};

export default PrimaryButton;
